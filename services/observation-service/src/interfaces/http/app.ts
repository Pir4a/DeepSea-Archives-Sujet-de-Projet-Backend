import express from 'express';
import { auth, errorHandler, notFoundHandler } from '@deepsea/common';
import registerSpeciesRoutes from './routes/speciesRoutes';
import registerObservationRoutes from './routes/observationRoutes';

/**
 * Couche interfaces (HTTP) – composition de l'app Express.
 * On injectera plus tard les use cases/domain dans les contrôleurs via deps.
 */
export function createApp(deps: any = {}) {
  const app = express();
  app.use(express.json());

  // Toutes les opérations utilisateur doivent être protégées par JWT.
  app.use(auth.authMiddleware);

  // Routes principales
  registerSpeciesRoutes(app, deps);
  registerObservationRoutes(app, deps);

  // 404 + gestion d'erreurs communes
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}


