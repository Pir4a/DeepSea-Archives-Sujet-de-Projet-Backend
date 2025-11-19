import express from 'express';
import * as observationController from '../controllers/observationController';

/**
 * Routes HTTP pour les observations et leur validation.
 */
export default function registerObservationRoutes(app: any, deps: any) {
  const router = express.Router();

  router.post('/observations', observationController.createObservation);
  router.get(
    '/species/:id/observations',
    observationController.listObservationsForSpecies,
  );
  router.post(
    '/observations/:id/validate',
    observationController.validateObservation,
  );
  router.post(
    '/observations/:id/reject',
    observationController.rejectObservation,
  );

  app.use('/', router);
}

