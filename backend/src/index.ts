import express, { Request, Response, NextFunction } from 'express';
import { blinksRouter } from './routers/blinks';
import { initializeDatabase } from './database/database';
import { discordRouter } from './routers/discord';
import helmet from 'helmet';
import { actionCorsMiddleware, BLOCKCHAIN_IDS } from '@solana/actions';
import env from './services/env';
import './cron/remove-expired-roles';
import { loginRouter } from './routers/login';
import winston from 'winston';

require('console-stamp')(console, 'dd/mm/yyyy HH:MM:ss');

// Initialize database
initializeDatabase();

// Set up logging with winston
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'app.log' })
  ]
});

const app = express();

// Middleware setup
app.use(express.json());
app.use(helmet());

// Dynamic CORS middleware based on environment
const chainId = process.env.CHAIN_ID || BLOCKCHAIN_IDS.mainnet;
app.use(actionCorsMiddleware({ chainId }));

// API Redirect for browsers
app.use((req, res, next) => {
  if (req.hostname === 'api.blinkshare.com' && req.path === '/') {
    const userAgent = req.headers['user-agent'] || '';
    const isBrowser = /Mozilla|Chrome|Safari|Edge|Opera/.test(userAgent);
    
    if (isBrowser) {
      return res.redirect(301, 'https://blinkord.com');
    }
  }
  next();
});

// Route to provide actions.json
app.get('/actions.json', (req: Request, res: Response) =>
  res.json({
    rules: [
      { pathPattern: '/', apiPath: '/blinks/' },
      { pathPattern: '/blinks/**', apiPath: `${env.APP_BASE_URL}/blinks/**` },
    ],
  }),
);

// API Routes
app.use('/login', loginRouter);
app.use('/blinks', blinksRouter);
app.use('/discord', discordRouter);

// Custom Error Handling Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.stack);  // Log error details
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
const PORT = 8080;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
