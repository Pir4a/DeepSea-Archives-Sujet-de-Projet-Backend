import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { auth, errorHandler, notFoundHandler } from '@deepsea/common';
import registerSpeciesRoutes from './routes/speciesRoutes';
import registerObservationRoutes from './routes/observationRoutes';
import { swaggerSpec } from './swagger';
import type { ObservationServiceDeps } from '../../application/types';
import { PrismaSpeciesRepository } from '../../infrastructure/repositories/PrismaSpeciesRepository';
import { PrismaObservationRepository } from '../../infrastructure/repositories/PrismaObservationRepository';
import { AuthServiceClient } from '../../infrastructure/services/AuthServiceClient';

/**
 * Couche interfaces (HTTP) – composition de l'app Express.
 * On injectera plus tard les use cases/domain dans les contrôleurs via deps.
 */
export function createApp(deps: Partial<ObservationServiceDeps> = {}) {
  const defaultDeps: ObservationServiceDeps = {
    speciesRepository: PrismaSpeciesRepository,
    observationRepository: PrismaObservationRepository,
    authService: new AuthServiceClient(),
  };

  const resolvedDeps: ObservationServiceDeps = {
    ...defaultDeps,
    ...deps,
  };

  const app = express();
  app.use(express.json());

  // Swagger UI - accessible without authentication for documentation
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Observation Service API Documentation',
  }));

  // Swagger JSON endpoint
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  // Toutes les opérations utilisateur doivent être protégées par JWT.
  app.use(auth.authMiddleware);

  // Routes principales
  registerSpeciesRoutes(app, resolvedDeps);
  registerObservationRoutes(app, resolvedDeps);

  // 404 + gestion d'erreurs communes
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

