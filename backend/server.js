import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';
import hpp from 'hpp';
import colors from 'colors';
import compression from 'compression';
import { rateLimit } from 'express-rate-limit';
import userRouter from './routes/user.routes.js';
import { connectDB } from './db/DBConnect.js';
import path from 'path';

dotenv.config();
const port = process.env.PORT || 5010;
const app = express();

// Security Middlewares
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    legacyHeaders: false,
    message: 'Too many requests from this IP. Please try after sometime.',
  })
);
app.use(helmet());
app.use(hpp());
app.use(
  '/api',
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'device-remember-token',
      'Access-Control-Allow-Origin',
      'Origin',
      'Accept',
    ],
  })
);

// Request Response Middlewares
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'frontend/dist')));
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());
app.use(compression());

// connect DB
connectDB();
// routes
app.use('/api/v1/users', userRouter);

if (process.env.NODE_ENV === 'production') {
  app.get('/{*splat}', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({
      message: 'Development server is running...',
      status: 'ok',
    });
  });
}

// 404 Handler (always at the bottom)
app.use((req, res) => {
  res.status(404).json({
    status: 404,
    message: 'Route not found!',
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500);
  res.json({
    status: err.statusCode || 500,
    success: false,
    data: null,
    message: err?.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`.blue);
});
