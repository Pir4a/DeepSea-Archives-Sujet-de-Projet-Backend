"use strict";
// Use case : création d'une Observation.
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = execute;
const common_1 = require("@deepsea/common");
const Observation_1 = require("../../domain/entities/Observation");
const rarity_1 = require("../services/rarity");
const FIVE_MINUTES_MS = 5 * 60 * 1000;
async function execute(deps, input) {
    const { observationRepository, speciesRepository } = deps;
    const { speciesId, authorId } = input;
    if (!Number.isFinite(speciesId)) {
        throw new common_1.AppError('Valid speciesId is required', 400);
    }
    if (!Number.isFinite(authorId)) {
        throw new common_1.AppError('Valid authorId is required', 400);
    }
    const species = await speciesRepository.findById(speciesId);
    if (!species) {
        throw new common_1.AppError('Species not found', 404);
    }
    const description = input.description?.trim();
    if (!description) {
        throw new common_1.AppError('Description is required', 400);
    }
    const dangerLevel = input.dangerLevel ?? 1;
    if (!Number.isFinite(dangerLevel)) {
        throw new common_1.AppError('dangerLevel must be numeric', 400);
    }
    if (dangerLevel < 1 || dangerLevel > 5) {
        throw new common_1.AppError('dangerLevel must be between 1 and 5', 400);
    }
    const last = await observationRepository.findLastBySpeciesAndAuthor(speciesId, authorId);
    if (last) {
        const elapsed = Date.now() - new Date(last.createdAt).getTime();
        if (elapsed < FIVE_MINUTES_MS) {
            throw new common_1.AppError('You must wait 5 minutes before recording another observation for this species', 400);
        }
    }
    const observation = (0, Observation_1.createObservation)({
        speciesId,
        authorId,
        description,
        dangerLevel,
    });
    const created = await observationRepository.create(observation);
    await observationRepository.createHistoryEntry({
        observationId: created.id,
        speciesId: created.speciesId,
        authorId: created.authorId,
        action: 'CREATED',
        payload: { dangerLevel: created.dangerLevel },
    });
    await (0, rarity_1.recalculateRarityForSpecies)(created.speciesId, observationRepository, speciesRepository);
    return created;
}
