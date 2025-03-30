// backend/routes/toolRoutes.ts
import { Router } from 'express';
import multer from 'multer';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import axios from 'axios';
import FormData from 'form-data';


dotenv.config();

const router = Router();
const upload = multer({ dest: 'uploads/' });

// Set ffmpeg path
ffmpeg.setFfmpegPath(ffmpegPath as unknown as string);


/**
 * POST /api/tools/removebg
 * Accepts an image upload and returns the background-removed image.
 */
router.post('/removebg', upload.single('image'), async (req, res): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ error: 'No image uploaded' });
    return;
  }

  const inputFilePath = req.file.path;

  try {
    const form = new FormData();
    form.append('image_file', fs.createReadStream(inputFilePath));
    // (Optional) form.append('size', 'auto');

    const response = await axios({
      method: 'post',
      url: 'https://api.remove.bg/v1.0/removebg',
      data: form,
      responseType: 'arraybuffer', // expect binary data
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




//////////////////////////////////////////////////////////////////////////
// VoiceCraft - process audio file to modulate voice
//////////////////////////////////////////////////////////////////////////

/**
 * POST /api/tools/voicecraft
 * Accepts an audio file and parameters (pitch, speed) then returns the modulated audio.
 *
 * Expected form-data fields:
 *   - "audio": the uploaded audio file (MP3 or WAV)
 *   - "pitch": (optional) slider value (0-100) where 50 is neutral (1.0 multiplier)
 *   - "speed": (optional) slider value (0-100) where 50 is neutral (1.0 multiplier)
 */

// VoiceCraft endpoint in backend/routes/toolRoutes.ts
router.post('/voicecraft', upload.single('audio'), async (req, res): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ error: 'No audio file uploaded' });
    return;
  }

  // Get pitch and speed slider values (0-100, with 50 as neutral)
  const pitchVal = req.body.pitch ? parseFloat(req.body.pitch) : 50;
  const speedVal = req.body.speed ? parseFloat(req.body.speed) : 50;
  const voiceModel = req.body.voiceModel || 'default';

  // Convert slider values to multipliers (neutral: 50 -> 1.0)
  let pitchMultiplier = pitchVal / 50;      // e.g., 60 -> 1.2
  let speedMultiplier = speedVal / 50;      // e.g., 40 -> 0.8
  let netMultiplier = pitchMultiplier * speedMultiplier;

  // Adjust netMultiplier based on voiceModel.
  // These adjustments simulate a change in tone without applying an extra filter.
  switch (voiceModel) {
    case 'professional':
      // Use the multipliers as is.
      break;
    case 'cartoon':
      // Boost pitch further for a cartoon effect.
      netMultiplier = netMultiplier * 1.2;
      break;
    case 'celebrity':
      // Slightly lower the pitch for a celebrity effect.
      netMultiplier = netMultiplier * 0.9;
      break;
    case 'default':
    default:
      break;
  }

  // Build filter chain:
  // 1. Change pitch by adjusting the sample rate.
  // 2. Resample back to 44100.
  // 3. Adjust tempo with atempo using the inverse of netMultiplier to keep overall duration unchanged.
  const filter = `[0:a]asetrate=44100*${netMultiplier},aresample=44100,atempo=${(1 / netMultiplier).toFixed(2)}[a]`;

  const inputFilePath = req.file.path;
  const outputFilePath = path.join('uploads', `processed-${req.file.filename}.mp3`);

  ffmpeg(inputFilePath)
    .outputOptions('-map', '[a]')
    .complexFilter([filter])
    .toFormat('mp3')
    .on('end', () => {
      fs.unlinkSync(inputFilePath);
      res.set('Content-Type', 'audio/mpeg');
      res.sendFile(path.resolve(outputFilePath), (err) => {
        if (!err) fs.unlinkSync(outputFilePath);
      });
    })
    .on('error', (err) => {
      console.error('Error processing audio:', err);
      fs.unlinkSync(inputFilePath);
      res.status(500).json({ error: 'Audio processing failed' });
    })
    .save(outputFilePath);
});





export default router;
