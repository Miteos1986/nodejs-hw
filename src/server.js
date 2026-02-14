import 'dotenv/config';

import cors from 'cors';
import express from 'express';
import pinoHttp from 'pino-http';

const app = express();
const logger = pinoHttp({
  transport:
    process.env.NODE_ENV === 'development'
      ? { target: 'pino-pretty' }
      : undefined,
});
app.use(logger);

app.use(cors());
express.json();

app.get('/notes', (req, res) => {
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
});

//test route for fehler
app.get('/test-error', (req, res) => {
  throw new Error('Simulated server error');
});

// undefined route 404
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = Number.parseInt(process.env.PORT, 10) || 5000;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }

  console.log(`Server started on server ${PORT}`);
});
