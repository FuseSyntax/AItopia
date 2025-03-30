  import 'dotenv/config'
  import express from 'express';
  import cors from 'cors';
  import bodyParser from 'body-parser';
  import toolRoutes from './routes/toolRoutes.js';
  import userRoutes from './routes/userRoutes.js';

  const app = express();
  const PORT = process.env.PORT || 5000;

  app.use(cors());
  app.use(bodyParser.json());

  // Mount routes (our removebg endpoint is now available at /api/tools/removebg)
  app.use('/api/tools', toolRoutes);
  app.use('/api/users', userRoutes);

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
