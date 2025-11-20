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
exports.createObservation = createObservation;
exports.listObservationsForSpecies = listObservationsForSpecies;
exports.validateObservation = validateObservation;
exports.rejectObservation = rejectObservation;
exports.listObservationHistory = listObservationHistory;
exports.deleteObservation = deleteObservation;
exports.restoreObservation = restoreObservation;
const common_1 = require("@deepsea/common");
const createObservationUseCase = __importStar(require("../../../application/usecases/createObservation"));
const listObservationsUseCase = __importStar(require("../../../application/usecases/listObservationsForSpecies"));
const validateObservationUseCase = __importStar(require("../../../application/usecases/validateObservation"));
const rejectObservationUseCase = __importStar(require("../../../application/usecases/rejectObservation"));
const listHistoryUseCase = __importStar(require("../../../application/usecases/listObservationHistory"));
const deleteObservationUseCase = __importStar(require("../../../application/usecases/deleteObservation"));
const restoreObservationUseCase = __importStar(require("../../../application/usecases/restoreObservation"));
const VALID_STATUSES = ['PENDING', 'VALIDATED', 'REJECTED'];
const STATUS_SET = new Set(VALID_STATUSES);
function ensureAuthenticatedUser(req) {
    if (!req.user?.id) {
        throw new common_1.AppError('Authenticated user required', 401);
    }
    return req.user;
}
function parseObservationId(req) {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
        throw new common_1.AppError('Invalid observation id', 400);
    }
    return id;
}
function parseOptionalNumber(value) {
    if (value === undefined || value === null || value === '') {
        return undefined;
    }
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
}
function createObservation(deps) {
    return async (req, res, next) => {
        try {
            const user = ensureAuthenticatedUser(req);
            const speciesId = Number(req.body?.speciesId);
            if (Number.isNaN(speciesId)) {
                throw new common_1.AppError('speciesId is required', 400);
            }
            const dangerLevelRaw = req.body?.dangerLevel;
            const dangerLevel = dangerLevelRaw === undefined || dangerLevelRaw === null
                ? undefined
                : Number(dangerLevelRaw);
            const observation = await createObservationUseCase.execute({
                observationRepository: deps.observationRepository,
                speciesRepository: deps.speciesRepository,
            }, {
                speciesId,
                authorId: Number(user.id),
                description: req.body?.description,
                dangerLevel,
            });
            res.status(201).json({ status: 'success', data: observation });
        }
        catch (error) {
            next(error);
        }
    };
}
function listObservationsForSpecies(deps) {
    return async (req, res, next) => {
        try {
            const speciesId = Number(req.params.id);
            if (Number.isNaN(speciesId)) {
                throw new common_1.AppError('Invalid species id', 400);
            }
            const statusParam = req.query.status;
            const status = typeof statusParam === 'string'
                ? statusParam
                    .split(',')
                    .map((value) => value.trim().toUpperCase())
                    .filter((value) => STATUS_SET.has(value))
                : undefined;
            const includeDeleted = req.query.includeDeleted === 'true';
            const observations = await listObservationsUseCase.execute({
                observationRepository: deps.observationRepository,
                speciesRepository: deps.speciesRepository,
            }, {
                speciesId,
                status,
                includeDeleted,
            });
            res.json({ status: 'success', data: observations });
        }
        catch (error) {
            next(error);
        }
    };
}
function validateObservation(deps) {
    return async (req, res, next) => {
        try {
            const user = ensureAuthenticatedUser(req);
            const observationId = parseObservationId(req);
            const observation = await validateObservationUseCase.execute({
                observationRepository: deps.observationRepository,
                authService: deps.authService,
            }, {
                observationId,
                validatorId: Number(user.id),
            });
            res.json({ status: 'success', data: observation });
        }
        catch (error) {
            next(error);
        }
    };
}
function rejectObservation(deps) {
    return async (req, res, next) => {
        try {
            const user = ensureAuthenticatedUser(req);
            const observationId = parseObservationId(req);
            const observation = await rejectObservationUseCase.execute({
                observationRepository: deps.observationRepository,
                authService: deps.authService,
            }, {
                observationId,
                reviewerId: Number(user.id),
                reason: req.body?.reason,
            });
            res.json({ status: 'success', data: observation });
        }
        catch (error) {
            next(error);
        }
    };
}
function listObservationHistory(deps) {
    return async (req, res, next) => {
        try {
            const history = await listHistoryUseCase.execute({
                observationRepository: deps.observationRepository,
                speciesRepository: deps.speciesRepository,
            }, {
                speciesId: parseOptionalNumber(req.query.speciesId),
                observationId: parseOptionalNumber(req.query.observationId),
                limit: parseOptionalNumber(req.query.limit),
            });
            res.json({ status: 'success', data: history });
        }
        catch (error) {
            next(error);
        }
    };
}
function deleteObservation(deps) {
    return async (req, res, next) => {
        try {
            const user = ensureAuthenticatedUser(req);
            const observationId = parseObservationId(req);
            const deleted = await deleteObservationUseCase.execute({
                observationRepository: deps.observationRepository,
                speciesRepository: deps.speciesRepository,
            }, {
                observationId,
                performedBy: Number(user.id),
            });
            res.json({ status: 'success', data: deleted });
        }
        catch (error) {
            next(error);
        }
    };
}
function restoreObservation(deps) {
    return async (req, res, next) => {
        try {
            const user = ensureAuthenticatedUser(req);
            const observationId = parseObservationId(req);
            const restored = await restoreObservationUseCase.execute({
                observationRepository: deps.observationRepository,
                speciesRepository: deps.speciesRepository,
            }, {
                observationId,
                performedBy: Number(user.id),
            });
            res.json({ status: 'success', data: restored });
        }
        catch (error) {
            next(error);
        }
    };
}
