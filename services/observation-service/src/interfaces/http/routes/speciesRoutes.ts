import express from 'express';
import * as speciesController from '../controllers/speciesController';
import { ObservationServiceDeps } from '../../../application/types';

/**
 * Routes HTTP pour les espèces.
 * À ce niveau, on ne met que le câblage Express, la logique métier est ailleurs.
 */
export default function registerSpeciesRoutes(
  app: any,
  deps: ObservationServiceDeps,
) {
  const router = express.Router();

  /**
   * @swagger
   * /species:
   *   post:
   *     summary: Create a new species
   *     tags: [Species]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateSpeciesRequest'
   *     responses:
   *       201:
   *         description: Species created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 data:
   *                   $ref: '#/components/schemas/Species'
   *       400:
   *         description: Invalid input
   *       409:
   *         description: Species name already exists
   */
  router.post('/species', speciesController.createSpecies(deps));

  /**
   * @swagger
   * /species/{id}:
   *   get:
   *     summary: Get a species by ID
   *     tags: [Species]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Species ID
   *     responses:
   *       200:
   *         description: Species found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 data:
   *                   $ref: '#/components/schemas/Species'
   *       404:
   *         description: Species not found
   */
  router.get('/species/:id', speciesController.getSpeciesById(deps));

  /**
   * @swagger
   * /species:
   *   get:
   *     summary: List all species
   *     tags: [Species]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: sortBy
   *         schema:
   *           type: string
   *           enum: [createdAt, rarityScore]
   *         description: Field to sort by
   *       - in: query
   *         name: order
   *         schema:
   *           type: string
   *           enum: [asc, desc]
   *         description: Sort order
   *       - in: query
   *         name: minRarity
   *         schema:
   *           type: number
   *         description: Minimum rarity score filter
   *     responses:
   *       200:
   *         description: List of species
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
   *                     $ref: '#/components/schemas/Species'
   */
  router.get('/species', speciesController.listSpecies(deps));

  app.use('/', router);
}

