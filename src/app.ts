import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes.js';
import config from './config/config.js';
import urlRouter from './routes/url.routes.js';

const app = express();

// Security
app.use(
  cors({
    origin: config.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  }),
);

app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRouter);

app.use('/api/url', urlRouter);

app.use('/', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Server is running...',
  });
});

export default app;
