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

const baseURL = process.env.API_BASE_URL || 'http://localhost:5000/api';


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

// ----- ASR Endpoint -----
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

// ----- Translation Endpoint -----
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

// ----- Image Generation Endpoint -----
router.post('/generate-art', async (req, res) => {
  const { prompt, style, creativity, aspectRatio } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }
  try {
    // Compute width and height based on aspect ratio (base width = 512)
    const width = 512;
    let height = 512;
    if (aspectRatio === '16:9') {
      height = Math.round(width * 9 / 16);
    } else if (aspectRatio === '9:16') {
      height = Math.round(width * 16 / 9);
    } else if (aspectRatio === '4:3') {
      height = Math.round(width * 3 / 4);
    }
    
    // Compose the input string.
    const input = `${prompt}, art style: ${style}, creativity: ${creativity}%, aspect ratio: ${aspectRatio}`;
    console.log("Input to generate-art:", input);
    
    // Request 2 images from the model. We use responseType: 'arraybuffer' to capture binary data.
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2',
      { 
        inputs: input,
        parameters: { num_images_per_prompt: 2, width, height }
      },
      {
        headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` },
        timeout: 60000,
        responseType: 'arraybuffer'
      }
    );
    
    // Check the Content-Type header to decide how to parse the response.
    const contentType = response.headers['content-type'];
    let images: string[] = [];
    
    if (contentType && contentType.includes('application/json')) {
      // If the response is JSON, parse it.
      const jsonData = JSON.parse(Buffer.from(response.data).toString());
      console.log("JSON response data:", jsonData);
      if (Array.isArray(jsonData)) {
        images = jsonData.map((img: any) => {
          let imageData = img.generated_image || img;
          if (typeof imageData === 'string') {
            if (!imageData.startsWith('data:') && !imageData.startsWith('http')) {
              imageData = `data:image/png;base64,${imageData}`;
            }
            return imageData;
          }
          return '';
        }).filter((url: string) => url !== '');
      } else if (jsonData.generated_image) {
        let imageData = jsonData.generated_image;
        if (typeof imageData === 'string') {
          if (!imageData.startsWith('data:') && !imageData.startsWith('http')) {
            imageData = `data:image/png;base64,${imageData}`;
          }
          images = [imageData];
        }
      }
    } else if (contentType && contentType.includes('image/')) {
      // If the response is an image, convert it to a base64 string.
      const base64Image = Buffer.from(response.data).toString('base64');
      images = [`data:${contentType};base64,${base64Image}`];
    } else {
      console.error("Unexpected content-type:", contentType);
    }
    
    // If only one image is returned, duplicate it.
    if (images.length === 1) {
      images.push(images[0]);
    }
    
    if (images.length < 1) {
      console.error('Not enough images returned:', images);
      return res.status(500).json({ error: 'Image generation failed: not enough images returned' });
    }
    
    res.json({ images });
  } catch (error: any) {
    if (error.response && error.response.status === 503) {
      console.error('Hugging Face API is unavailable. Check your API quota or try again later.');
      return res.status(503).json({ error: 'Service Unavailable: Hugging Face API is down or over quota.' });
    }
    console.error('Image generation error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Image generation failed' });
  }
});



export default router;