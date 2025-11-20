import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { errorHandler, notFoundHandler } from '@deepsea/common';
import { HttpObservationServiceClient } from '../../infrastructure/services/HttpObservationServiceClient';
import registerTaxonomyRoutes from './routes/taxonomyRoutes';
import { specs } from './swagger';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Documentation
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

  // Dependencies
  // Assuming observation-service is at localhost:4002 locally or deepsea-observation-service:4002 in docker
  // We should use environment variable
  const observationServiceUrl = process.env.OBSERVATION_SERVICE_URL || 'http://localhost:4002';
  const observationServiceClient = new HttpObservationServiceClient(observationServiceUrl);

  const deps = {
    observationServiceClient,
  };

  // Routes
  registerTaxonomyRoutes(app, deps);

  // Errors
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

