// backend/routes/toolRoutes.ts
import { Router } from 'express';
import multer from 'multer';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const router = Router();
const upload = multer({ dest: 'uploads/' });

// POST /api/removebg
router.post('/removebg', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }

  const inputFilePath = req.file.path;
  const outputFilePath = path.join('uploads', `processed-${req.file.filename}.png`);

  // Spawn Python process to run remove_bg.py
  const pythonProcess = spawn('python', ['remove_bg.py', inputFilePath, outputFilePath]);

  pythonProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    if (code !== 0) {
      // Delete the input file if processing failed
      fs.unlinkSync(inputFilePath);
      return res.status(500).json({ error: 'Background removal failed' });
    }
    // Send the processed image file back to the client
    res.sendFile(path.resolve(outputFilePath), (err) => {
      // Clean up temporary files after sending response
      fs.unlinkSync(inputFilePath);
      fs.unlinkSync(outputFilePath);
    });
  });
});

export default router;
