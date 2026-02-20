import 'dotenv/config';

import cors from 'cors';
import express from 'express';

import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './middleware/logger.js';
import { connectMongoDB } from './db/connectMongoDB.js';
import notesRouter from './routes/notesRoutes.js';

const app = express();

app.use(logger);
app.use(
  express.json({
    type: ['application/json', 'application/vnd.api+json'],
  }),
);
app.use(cors());

await connectMongoDB();

app.use(notesRouter);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = Number.parseInt(process.env.PORT, 10) || 3000;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }

  console.log(`Server started on server ${PORT}`);
});
