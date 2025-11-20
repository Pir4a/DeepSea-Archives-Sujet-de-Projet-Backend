import express from 'express';
import { auth } from '@deepsea/common';
import * as taxonomyController from '../controllers/TaxonomyController';
import { GetTaxonomyStatsDeps } from '../../../application/usecases/GetTaxonomyStats';

export default function registerTaxonomyRoutes(
  app: express.Application,
  deps: GetTaxonomyStatsDeps,
) {
  const router = express.Router();

  /**
   * @swagger
   * /taxonomy/stats:
   *   get:
   *     summary: Get taxonomy statistics
   *     tags: [Taxonomy]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Taxonomy statistics
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 data:
   *                   $ref: '#/components/schemas/TaxonomyStats'
   */
  router.get('/taxonomy/stats', auth.authMiddleware, taxonomyController.getStats(deps));

  app.use('/', router);
}

