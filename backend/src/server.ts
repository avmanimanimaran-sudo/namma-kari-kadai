import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import connectDB from './config/db';
import { connectRedis } from './config/redis';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Connect to Database
        await connectDB();

        // Connect to Redis
        await connectRedis();

        app.listen(PORT, () => {
            console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
