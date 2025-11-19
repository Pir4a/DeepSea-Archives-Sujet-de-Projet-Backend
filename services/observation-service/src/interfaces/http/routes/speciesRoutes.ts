const express = require('express');
const speciesController = require('../controllers/speciesController');

/**
 * Routes HTTP pour les espèces.
 * À ce niveau, on ne met que le câblage Express, la logique métier est ailleurs.
 */
function registerSpeciesRoutes(app: any, deps: any) {
  const router = express.Router();

  router.post('/species', speciesController.createSpecies);
  router.get('/species/:id', speciesController.getSpeciesById);
  router.get('/species', speciesController.listSpecies);

  app.use('/', router);
}

module.exports = registerSpeciesRoutes;


