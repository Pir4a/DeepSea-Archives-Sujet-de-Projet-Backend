"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = registerObservationRoutes;
const express_1 = __importDefault(require("express"));
const common_1 = require("@deepsea/common");
const observationController = __importStar(require("../controllers/observationController"));
/**
 * Routes HTTP pour les observations et leur validation.
 */
function registerObservationRoutes(app, deps) {
    const router = express_1.default.Router();
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
    router.get('/species/:id/observations', observationController.listObservationsForSpecies(deps));
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
    router.post('/observations/:id/validate', observationController.validateObservation(deps));
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
    router.post('/observations/:id/reject', observationController.rejectObservation(deps));
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
    router.get('/observations/history', common_1.auth.requireRole('EXPERT', 'ADMIN'), observationController.listObservationHistory(deps));
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
    router.delete('/observations/:id', common_1.auth.requireRole('EXPERT', 'ADMIN'), observationController.deleteObservation(deps));
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
    router.post('/observations/:id/restore', common_1.auth.requireRole('EXPERT', 'ADMIN'), observationController.restoreObservation(deps));
    app.use('/', router);
}
