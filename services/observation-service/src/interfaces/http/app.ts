const express = require('express');
const { auth, errorHandler, notFoundHandler } = require('@deepsea/common');
const registerSpeciesRoutes = require('./routes/speciesRoutes');
const registerObservationRoutes = require('./routes/observationRoutes');

/**
 * Couche interfaces (HTTP) – composition de l'app Express.
 * On injectera plus tard les use cases/domain dans les contrôleurs via deps.
 */
function createApp(deps: any = {}) {
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

module.exports = { createApp };


