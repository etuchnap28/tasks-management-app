import mongoose from 'mongoose';
import { config } from '@config/config';

export const connectDB = async () => {
    await mongoose.connect(config.mongo.uri);
};
