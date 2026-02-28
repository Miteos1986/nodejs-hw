import mongoose from 'mongoose';
import { Note } from '../models/note.js';

const clientOptions = {
  dbName: 'students',
  serverApi: { version: '1', strict: false, deprecationErrors: true },
};

export const connectMongoDB = async () => {
  try {
    const uri = process.env.MONGO_URL;

    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    await Note.ensureIndexes();
    console.log('✅ MongoDB connection established successfully');
  } catch (error) {
    console.error('Failed to connect to db', error);
    process.exit(1);
  }
};
