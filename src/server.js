import 'dotenv/config';

import cors from 'cors';
import express from 'express';

import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './middleware/logger.js';
import { connectMongoDB } from './db/connectMongoDB.js';
import { Note } from './models/note.js';

const app = express();

app.use(logger);
app.use(express.json());
app.use(cors());

await connectMongoDB();

/*app.get('/notes', async (req, res) => {
  const notes = await mongoose.connection.db
    .collection('notes')
    .find({})
    .toArray();
  res.json({
    message: 'Successfully found all notes',
    status: 200,
    data: notes,
  });
});*/

app.get('/notes', async (req, res) => {
  const notes = await Note.find();

  res.json({
    message: 'Successfuly find all notes',
    status: 200,
    data: notes,
  });
});

/*app.get('/notes', (req, res) => {
  res.json({
    message: 'Retrieved all notes',
  });
});

app.get('/notes/:noteId', (req, res, next) => {
  const { noteId } = req.params;

  if (noteId === '0') {
    const err = new Error('Something went wrong via next!');
    return next(err);
  }

  res.json({ message: `Retrieved note with ID:${noteId}` });
});*/

// undefined route 404
app.use(notFoundHandler);
// server error 500
app.use(errorHandler);

const PORT = Number.parseInt(process.env.PORT, 10) || 3000;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }

  console.log(`Server started on server ${PORT}`);
});
