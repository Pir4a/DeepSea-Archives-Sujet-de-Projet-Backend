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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSpecies = createSpecies;
exports.getSpeciesById = getSpeciesById;
exports.listSpecies = listSpecies;
const common_1 = require("@deepsea/common");
const createSpeciesUseCase = __importStar(require("../../../application/usecases/createSpecies"));
const listSpeciesUseCase = __importStar(require("../../../application/usecases/listSpecies"));
const getSpeciesUseCase = __importStar(require("../../../application/usecases/getSpecies"));
const SORTABLE_FIELDS = new Set(['createdAt', 'rarityScore']);
const ORDER_VALUES = new Set(['asc', 'desc']);
function ensureAuthenticatedUser(req) {
    if (!req.user?.id) {
        throw new common_1.AppError('Authenticated user required', 401);
    }
    return req.user;
}
function createSpecies(deps) {
    return async (req, res, next) => {
        try {
            const user = ensureAuthenticatedUser(req);
            const species = await createSpeciesUseCase.execute({ speciesRepository: deps.speciesRepository }, {
                authorId: Number(user.id),
                name: req.body?.name,
            });
            res.status(201).json({ status: 'success', data: species });
        }
        catch (error) {
            next(error);
        }
    };
}
function getSpeciesById(deps) {
    return async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) {
                throw new common_1.AppError('Invalid species id', 400);
            }
            const species = await getSpeciesUseCase.execute({ speciesRepository: deps.speciesRepository }, { id });
            res.json({ status: 'success', data: species });
        }
        catch (error) {
            next(error);
        }
    };
}
function listSpecies(deps) {
    return async (req, res, next) => {
        try {
            const { sortBy, order, minRarity } = req.query;
            const safeSort = typeof sortBy === 'string' && SORTABLE_FIELDS.has(sortBy)
                ? sortBy
                : undefined;
            const safeOrder = typeof order === 'string' && ORDER_VALUES.has(order)
                ? order
                : undefined;
            const parsedMinRarity = typeof minRarity === 'string' ? Number(minRarity) : undefined;
            const species = await listSpeciesUseCase.execute({ speciesRepository: deps.speciesRepository }, {
                sortBy: safeSort,
                order: safeOrder,
                minRarity: parsedMinRarity,
            });
            res.json({ status: 'success', data: species });
        }
        catch (error) {
            next(error);
        }
    };
}
