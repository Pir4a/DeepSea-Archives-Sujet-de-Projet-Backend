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
exports.default = registerSpeciesRoutes;
const express_1 = __importDefault(require("express"));
const speciesController = __importStar(require("../controllers/speciesController"));
/**
 * Routes HTTP pour les espèces.
 * À ce niveau, on ne met que le câblage Express, la logique métier est ailleurs.
 */
function registerSpeciesRoutes(app, deps) {
    const router = express_1.default.Router();
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
