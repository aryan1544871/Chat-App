import moongoose from 'mongoose';

export const connectDB = async () => {
  try {
   const conn =  await moongoose.connect(process.env.MONGODB_URI);
   console.log('Database connected successfully', conn.connection.host);
  }
    catch (error) { 
    console.log('Error connecting to database', error);
  }
}