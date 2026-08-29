import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Config & Routes Imports
import pool from './config/db.js';
import apiRoutes from './routes/index.js';
import { errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));


// Health Check Route
app.get('/', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Library System API is running...' });
});

// All Routes API Endpoint
app.use('/api', apiRoutes);

// Global Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Test DB Connection and Start Server
const startServer = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL Database Connected Successfully!');
    connection.release();

    app.listen(PORT, () => {
      console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('💥 Database Connection Failed:', error.message);
    process.exit(1);
  }
};

startServer();