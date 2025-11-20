import express from 'express';
import proxy from 'express-http-proxy';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './swagger.json';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Security & Logging
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Service URLs (from environment or defaults)
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://auth-service:3001';
const OBSERVATION_SERVICE_URL = process.env.OBSERVATION_SERVICE_URL || 'http://observation-service:4002';
const TAXONOMY_SERVICE_URL = process.env.TAXONOMY_SERVICE_URL || 'http://taxonomy-service:4003';

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes Configuration
const routes = [
  {
    prefix: '/auth',
    target: AUTH_SERVICE_URL,
  },
  {
    prefix: '/admin',
    target: AUTH_SERVICE_URL,
  },
  {
    prefix: '/species',
    target: OBSERVATION_SERVICE_URL,
  },
  {
    prefix: '/observations',
    target: OBSERVATION_SERVICE_URL,
  },
  {
    prefix: '/taxonomy',
    target: TAXONOMY_SERVICE_URL,
  },
];

// Register Proxy Routes
routes.forEach((route) => {
  app.use(
    route.prefix,
    proxy(route.target, {
      proxyReqPathResolver: (req) => {
        // Keeps the prefix in the forwarded request
        // e.g. /auth/login -> /auth/login (if auth service expects /auth prefix)
        // OR rewrites if needed.
        // Assuming services are mounted on root or handle their own prefixes.
        // Auth service has /auth routes, so we forward as is.
        // Observation service has /species at root, so we forward as is.
        return route.prefix + req.url;
      },
      userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
        // Optional: Transform response or handle errors centrally
        return proxyResData;
      },
    })
  );
});

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Gateway Error:', err);
  res.status(500).json({ status: 'error', message: 'Internal Gateway Error' });
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
  console.log(`- Auth Service: ${AUTH_SERVICE_URL}`);
  console.log(`- Observation Service: ${OBSERVATION_SERVICE_URL}`);
  console.log(`- Taxonomy Service: ${TAXONOMY_SERVICE_URL}`);
});

