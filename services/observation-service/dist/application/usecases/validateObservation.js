"use strict";
// Use case : validation d'une Observation.
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = execute;
const common_1 = require("@deepsea/common");
const AUTHOR_REWARD = 5;
const VALIDATOR_REWARD = 2;
async function execute(deps, input) {
    const { observationRepository, authService } = deps;
    const observation = await observationRepository.findById(input.observationId);
    if (!observation || observation.deletedAt) {
        throw new common_1.AppError('Observation not found', 404);
    }
    if (observation.status !== 'PENDING') {
        throw new common_1.AppError('Observation already reviewed', 409);
    }
    if (observation.authorId === input.validatorId) {
        throw new common_1.AppError('You cannot validate your own observation', 403);
    }
    const updated = await observationRepository.updateStatus(observation.id, {
        status: 'VALIDATED',
        validatedBy: input.validatorId,
        validatedAt: new Date(),
    });
    await observationRepository.createHistoryEntry({
        observationId: observation.id,
        speciesId: observation.speciesId,
        authorId: observation.authorId,
        performedBy: input.validatorId,
        action: 'VALIDATED',
        payload: { previousStatus: observation.status },
    });
    await Promise.all([
        authService?.sendReputationDelta({
            userId: observation.authorId,
            delta: AUTHOR_REWARD,
            reason: 'Observation validated',
            observationId: observation.id,
            status: 'VALIDATED',
        }) ?? Promise.resolve(),
        authService?.sendReputationDelta({
            userId: input.validatorId,
            delta: VALIDATOR_REWARD,
            reason: 'Validation performed',
            observationId: observation.id,
            status: 'VALIDATED',
        }) ?? Promise.resolve(),
    ]);
    return updated;
}
