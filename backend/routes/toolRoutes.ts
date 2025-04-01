import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import axios from 'axios';
import FormData from 'form-data';
import { createRequire } from 'module';

dotenv.config();
const require = createRequire(import.meta.url);
const router = Router();
const upload = multer({ dest: 'uploads/' });

// ----- Removebg Endpoint -----
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

// ----- Voicecraft Endpoint -----
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

// ----- Upload & Audio Extraction Endpoint -----
router.post('/upload', upload.single('video'), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: 'No video uploaded' });
    return;
  }
  const videoPath = req.file.path;
  const audioPath = path.join('uploads', `${req.file.filename}.m4a`);
  const ffmpeg = require('fluent-ffmpeg');
  const ffmpegStatic = require('ffmpeg-static');
  ffmpeg.setFfmpegPath(ffmpegStatic);
  ffmpeg(videoPath)
    .noVideo()
    .audioCodec('copy')
    .save(audioPath)
    .on('end', () => {
      fs.unlinkSync(videoPath);
      res.json({ audioPath });
    })
    .on('error', (err: Error) => {
      console.error('Error extracting audio:', err);
      res.status(500).json({ error: 'Audio extraction failed' });
    });
});

// ----- ASR Endpoint (updated with file deletion after 1 min on error) -----
router.post('/asr', upload.single('audio'), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: 'No audio file provided' });
    return;
  }
  const audioPath = req.file.path;
  try {
    const audioData = fs.readFileSync(audioPath);
    const contentType = 'audio/m4a';
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/openai/whisper-small',
      audioData,
      {
        headers: {
          'Content-Type': contentType,
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`
        },
        timeout: 30000
      }
    );
    // Delete file immediately on success
    fs.unlinkSync(audioPath);
    res.json(response.data);
  } catch (error: any) {
    console.error('ASR error:', error.response?.data || error.message);
    // Schedule deletion after 1 minute if the file still exists
    setTimeout(() => {
      if (fs.existsSync(audioPath)) {
        fs.unlinkSync(audioPath);
        console.log(`Deleted file ${audioPath} after 1 minute.`);
      }
    }, 60000);
    res.status(500).json({ error: 'ASR failed' });
  }
});

// ----- Translation Endpoint (single version) -----
router.post('/translate', async (req, res) => {
  const { text, targetLanguage } = req.body;
  if (!text || !targetLanguage) {
    res.status(400).json({ error: 'Text and target language required' });
    return;
  }
  try {
    const response = await axios.post('https://libretranslate.de/translate', {
      q: text,
      source: 'auto',
      target: targetLanguage,
      format: "text"
    });
    res.json(response.data);
  } catch (error: any) {
    console.error('Translation error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Translation failed' });
  }
});

// ----- SRT Generation Endpoint -----
router.post('/srt', async (req, res) => {
  const { segments } = req.body;
  if (!segments || !Array.isArray(segments)) {
    res.status(400).json({ error: 'Segments array is required' });
    return;
  }
  const srt = segments.map((seg: any, i: number) => {
    return `${i + 1}\n${formatTimestamp(seg.start)} --> ${formatTimestamp(seg.end)}\n${seg.text}\n`;
  }).join('\n');
  res.setHeader('Content-Type', 'text/plain');
  res.send(srt);
});

function formatTimestamp(seconds: number) {
  const date = new Date(0);
  date.setSeconds(seconds);
  return date.toISOString().substr(11, 12).replace('.', ',');
}

export default router;
