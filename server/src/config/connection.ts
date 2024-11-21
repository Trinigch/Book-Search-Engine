import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/googlebooks';
mongoose.connect(MONGODB_URI);
const db = mongoose.connection

export default db;