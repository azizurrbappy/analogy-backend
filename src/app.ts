import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes.js';
import config from './config/config.js';
import smsRouter from './routes/sms.routes.js';

const app = express();

// Security
app.use(
  cors({
    origin: [config.CLIENT_URL, 'http://localhost:3000', 'https://www.analogybd.com'],
    credentials: true,
  }),
);

app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRouter);

app.use('/api/sms', smsRouter);

app.use('/', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Server is running...',
  });
});

export default app;
