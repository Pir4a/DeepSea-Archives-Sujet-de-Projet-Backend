"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = execute;
const common_1 = require("@deepsea/common");
const rarity_1 = require("../services/rarity");
async function execute(deps, input) {
    const { observationRepository, speciesRepository } = deps;
    const observation = await observationRepository.findById(input.observationId);
    if (!observation) {
        throw new common_1.AppError('Observation not found', 404);
    }
    if (observation.deletedAt) {
        throw new common_1.AppError('Observation already deleted', 409);
    }
    const deleted = await observationRepository.softDelete(observation.id);
    await observationRepository.createHistoryEntry({
        observationId: observation.id,
        speciesId: observation.speciesId,
        authorId: observation.authorId,
        performedBy: input.performedBy,
        action: 'DELETED',
        payload: {
            status: observation.status,
        },
    });
    await (0, rarity_1.recalculateRarityForSpecies)(observation.speciesId, observationRepository, speciesRepository);
    return deleted;
}
