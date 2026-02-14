import 'dotenv/config';

import cors from 'cors';
import express from 'express';
import pinoHttp from 'pino-http';

const app = express();
const loger = pinoHttp();
app.use(loger);

app.use(cors());
express.json();

app.get('/notes', (req, res) => {
  res.json({
    message: 'Retrieved all notes',
  });
});

app.get('/notes/:noteId', (req, res) => {
  const { noteId } = req.params;

  res.json({ message: `Retrieved note with ID:${noteId}` });
});

const PORT = Number.parseInt(process.env.PORT, 10) || 5000;

app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }

  console.log(`Server started on server ${PORT}`);
});
