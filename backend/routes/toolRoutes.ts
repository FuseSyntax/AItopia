import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import axios from 'axios';
import FormData from 'form-data';
import agentManager from '../mcp/agentManager.js';

import { createRequire } from 'module'; // Import synchronously
dotenv.config();

const require = createRequire(import.meta.url);
const router = Router();
const upload = multer({ dest: 'uploads/' });

// Set up ffmpeg for endpoints that need it
let ffmpegAvailable = false;
try {
  const ffmpeg = require('fluent-ffmpeg');
  const ffmpegPath = require('ffmpeg-static');
  console.log("ffmpegPath:", ffmpegPath);
  if (ffmpegPath) {
    ffmpeg.setFfmpegPath(ffmpegPath);
    ffmpegAvailable = true;
  } else {
    console.error("ffmpeg-static did not return a valid path.");
  }
} catch (err) {
  console.error("Error setting up ffmpeg:", err);
}

/**
 * POST /api/tools/removebg
 * Accepts an image upload and returns the background-removed image.
 */
if (ffmpegAvailable) {
  router.post('/removebg', upload.single('image'), async (req, res): Promise<void> => {
    if (!req.file) {
      res.status(400).json({ error: 'No image uploaded' });
      return;
    }

    const inputFilePath = req.file.path;

    try {
      const form = new FormData();
      form.append('image_file', fs.createReadStream(inputFilePath));

      const response = await axios({
        method: 'post',
        url: 'https://api.remove.bg/v1.0/removebg',
        data: form,
        responseType: 'arraybuffer',
        headers: {
          ...form.getHeaders(),
          'X-Api-Key': process.env.REMOVE_BG_API_KEY,
        },
      });

      if (response.status !== 200) {
        res.status(500).json({ error: 'Error from remove.bg API' });
        return;
      }

      res.set('Content-Type', 'image/png');
      res.send(response.data);
    } catch (error) {
      console.error('Error calling remove.bg API:', error);
      res.status(500).json({ error: 'Background removal failed' });
    } finally {
      fs.unlinkSync(inputFilePath);
    }
  });

  /**
   * POST /api/tools/voicecraft
   * Accepts an audio file and parameters (pitch, speed) then returns the modulated audio.
   */
  router.post('/voicecraft', upload.single('audio'), async (req, res): Promise<void> => {
    if (!req.file) {
      res.status(400).json({ error: 'No audio file uploaded' });
      return;
    }

    const pitchVal = req.body.pitch ? parseFloat(req.body.pitch) : 50;
    const speedVal = req.body.speed ? parseFloat(req.body.speed) : 50;
    const voiceModel = req.body.voiceModel || 'default';

    let pitchMultiplier = pitchVal / 50;
    let speedMultiplier = speedVal / 50;
    let netMultiplier = pitchMultiplier * speedMultiplier;

    switch (voiceModel) {
      case 'professional':
        break;
      case 'cartoon':
        netMultiplier *= 1.2;
        break;
      case 'celebrity':
        netMultiplier *= 0.9;
        break;
      default:
        break;
    }

    const filter = `[0:a]asetrate=44100*${netMultiplier},aresample=44100,atempo=${(1 / netMultiplier).toFixed(2)}[a]`;

    const inputFilePath = req.file.path;
    const outputFilePath = path.join('uploads', `processed-${req.file.filename}.mp3`);

    // Use the same require that we already imported at the top.
    const ffmpeg = require('fluent-ffmpeg');

    ffmpeg(inputFilePath)
      .outputOptions('-map', '[a]')
      .complexFilter([filter])
      .toFormat('mp3')
      .on('end', () => {
        fs.unlinkSync(inputFilePath);
        res.set('Content-Type', 'audio/mpeg');
        res.sendFile(path.resolve(outputFilePath), (err: Error) => {
          if (!err) fs.unlinkSync(outputFilePath);
        });
      })
      .on('error', (err: Error) => {
        console.error('Error processing audio:', err);
        fs.unlinkSync(inputFilePath);
        res.status(500).json({ error: 'Audio processing failed' });
      })
      .save(outputFilePath);
  });
} else {
  console.warn("ffmpeg-dependent endpoints are disabled because ffmpeg setup failed.");
}

/**
 * POST /api/tools/linguo
 * Accepts text input and parameters (tone, creativity) and returns AI-generated content.
 */
router.post('/linguo', async (req, res): Promise<void> => {
  const { inputText, tone, creativity } = req.body;
  if (!inputText) {
    res.status(400).json({ error: 'No input text provided' });
    return;
  }

  // Check that the Hugging Face API key is set
  if (!process.env.HUGGINGFACE_API_KEY) {
    console.error('HUGGINGFACE_API_KEY is not defined.');
    res.status(500).json({ error: 'Server misconfiguration: HUGGINGFACE_API_KEY not set' });
    return;
  }

  let temperature = 0.7;
  if (tone === 'professional') {
    temperature = 0.6;
  } else if (tone === 'casual') {
    temperature = 0.8;
  } else if (tone === 'creative') {
    temperature = 0.9;
  }
  temperature *= (creativity ? parseFloat(creativity) / 75 : 1);

  // Debug logs to inspect the computed values
  console.log(`Received input: "${inputText}"`);
  console.log(`Tone: ${tone}, Creativity: ${creativity}`);
  console.log(`Calculated temperature: ${temperature}`);

  const model = "gpt2";
  const data = {
    inputs: inputText,
    parameters: {
      max_new_tokens: 100,
      temperature,
      top_p: 0.9,
      top_k: 50,
    },
  };

  try {
    const hfResponse = await axios.post(
      `https://api-inference.huggingface.co/models/${model}`,
      data,
      {
        headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` },
        timeout: 15000,
      }
    );

    console.log("Hugging Face response data:", hfResponse.data);

    let outputText;
    if (Array.isArray(hfResponse.data) && hfResponse.data.length > 0) {
      outputText = hfResponse.data[0].generated_text;
    } else if (hfResponse.data?.generated_text) {
      outputText = hfResponse.data.generated_text;
    }

    if (!outputText) {
      console.error("No text was generated. Response data:", hfResponse.data);
      res.status(500).json({ error: 'No text generated' });
      return;
    }
    res.json({ outputText });
  } catch (error: any) {
    if (error.response) {
      console.error('Error generating text (response):', error.response.data);
    } else if (error.request) {
      console.error('Error generating text (no response):', error.request);
    } else {
      console.error('Error generating text:', error.message);
    }
    res.status(500).json({ error: 'Text generation failed' });
  }
});


export default router;
