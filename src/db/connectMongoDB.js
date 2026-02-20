import mongoose from 'mongoose';

const clientOptions = {
  dbName: 'students',
  serverApi: { version: '1', strict: true, deprecationErrors: true },
};

export const connectMongoDB = async () => {
  try {
    const user = process.env.DB_USER;
    const password = process.env.DB_PASSWORD;
    const host = process.env.DB_HOST;
    const db = process.env.DB_NAME;

    const uri = `mongodb+srv://${user}:${password}@${host}/${db}?appName=Cluster0`;
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log('✅ MongoDB connection established successfully');
  } catch (error) {
    console.error('Failed to connect to db', error);
    process.exit(1);
  }
};
