import express from 'express';
import { auth } from '@deepsea/common';
import * as observationController from '../controllers/observationController';
import { ObservationServiceDeps } from '../../../application/types';

/**
 * Routes HTTP pour les observations et leur validation.
 */
export default function registerObservationRoutes(
  app: any,
  deps: ObservationServiceDeps,
) {
  const router = express.Router();

  /**
   * @swagger
   * /observations:
   *   post:
   *     summary: Create a new observation
   *     tags: [Observations]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateObservationRequest'
   *     responses:
   *       201:
   *         description: Observation created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 data:
   *                   $ref: '#/components/schemas/Observation'
   *       400:
   *         description: Invalid input or cooldown period not met
   *       404:
   *         description: Species not found
   */
  router.post('/observations', observationController.createObservation(deps));

  /**
   * @swagger
   * /species/{id}/observations:
   *   get:
   *     summary: List observations for a species
   *     tags: [Observations]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Species ID
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *         description: Filter by status (comma-separated: PENDING,VALIDATED,REJECTED)
   *       - in: query
   *         name: includeDeleted
   *         schema:
   *           type: boolean
   *         description: Include soft-deleted observations
   *     responses:
   *       200:
   *         description: List of observations
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Observation'
   *       404:
   *         description: Species not found
   */
  router.get(
    '/species/:id/observations',
    observationController.listObservationsForSpecies(deps),
  );

  /**
   * @swagger
   * /observations/{id}/validate:
   *   post:
   *     summary: Validate an observation
   *     tags: [Observations]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Observation ID
   *     responses:
   *       200:
   *         description: Observation validated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 data:
   *                   $ref: '#/components/schemas/Observation'
   *       403:
   *         description: Cannot validate your own observation
   *       404:
   *         description: Observation not found
   *       409:
   *         description: Observation already reviewed
   */
  router.post(
    '/observations/:id/validate',
    observationController.validateObservation(deps),
  );

  /**
   * @swagger
   * /observations/{id}/reject:
   *   post:
   *     summary: Reject an observation
   *     tags: [Observations]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Observation ID
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/RejectObservationRequest'
   *     responses:
   *       200:
   *         description: Observation rejected successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 data:
   *                   $ref: '#/components/schemas/Observation'
   *       403:
   *         description: Cannot review your own observation
   *       404:
   *         description: Observation not found
   *       409:
   *         description: Observation already reviewed
   */
  router.post(
    '/observations/:id/reject',
    observationController.rejectObservation(deps),
  );

  /**
   * @swagger
   * /observations/history:
   *   get:
   *     summary: List observation history (EXPERT/ADMIN only)
   *     tags: [Observations]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: speciesId
   *         schema:
   *           type: integer
   *         description: Filter by species ID
   *       - in: query
   *         name: observationId
   *         schema:
   *           type: integer
   *         description: Filter by observation ID
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *         description: Maximum number of results
   *     responses:
   *       200:
   *         description: List of history entries
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/ObservationHistory'
   *       403:
   *         description: Forbidden - EXPERT or ADMIN role required
   */
  router.get(
    '/observations/history',
    auth.requireRole('EXPERT', 'ADMIN'),
    observationController.listObservationHistory(deps),
  );

  /**
   * @swagger
   * /observations/{id}:
   *   delete:
   *     summary: Soft delete an observation (EXPERT/ADMIN only)
   *     tags: [Observations]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Observation ID
   *     responses:
   *       200:
   *         description: Observation deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 data:
   *                   $ref: '#/components/schemas/Observation'
   *       403:
   *         description: Forbidden - EXPERT or ADMIN role required
   *       404:
   *         description: Observation not found
   *       409:
   *         description: Observation already deleted
   */
  router.delete(
    '/observations/:id',
    auth.requireRole('EXPERT', 'ADMIN'),
    observationController.deleteObservation(deps),
  );

  /**
   * @swagger
   * /observations/{id}/restore:
   *   post:
   *     summary: Restore a soft-deleted observation (EXPERT/ADMIN only)
   *     tags: [Observations]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Observation ID
   *     responses:
   *       200:
   *         description: Observation restored successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 data:
   *                   $ref: '#/components/schemas/Observation'
   *       403:
   *         description: Forbidden - EXPERT or ADMIN role required
   *       404:
   *         description: Observation not found
   *       409:
   *         description: Observation is not deleted
   */
  router.post(
    '/observations/:id/restore',
    auth.requireRole('EXPERT', 'ADMIN'),
    observationController.restoreObservation(deps),
  );

  app.use('/', router);
}
