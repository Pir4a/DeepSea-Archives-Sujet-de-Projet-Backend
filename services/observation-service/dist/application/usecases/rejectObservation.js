"use strict";
// Use case : rejet d'une Observation.
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = execute;
const common_1 = require("@deepsea/common");
const AUTHOR_PENALTY = -2;
const REVIEWER_REWARD = 1;
async function execute(deps, input) {
    const { observationRepository, authService } = deps;
    const observation = await observationRepository.findById(input.observationId);
    if (!observation || observation.deletedAt) {
        throw new common_1.AppError('Observation not found', 404);
    }
    if (observation.status !== 'PENDING') {
        throw new common_1.AppError('Observation already reviewed', 409);
    }
    if (observation.authorId === input.reviewerId) {
        throw new common_1.AppError('You cannot review your own observation', 403);
    }
    const updated = await observationRepository.updateStatus(observation.id, {
        status: 'REJECTED',
        validatedBy: input.reviewerId,
        validatedAt: new Date(),
    });
    await observationRepository.createHistoryEntry({
        observationId: observation.id,
        speciesId: observation.speciesId,
        authorId: observation.authorId,
        performedBy: input.reviewerId,
        action: 'REJECTED',
        payload: {
            reason: input.reason ?? null,
            previousStatus: observation.status,
        },
    });
    await Promise.all([
        authService?.sendReputationDelta({
            userId: observation.authorId,
            delta: AUTHOR_PENALTY,
            reason: input.reason || 'Observation rejected',
            observationId: observation.id,
            status: 'REJECTED',
        }) ?? Promise.resolve(),
        authService?.sendReputationDelta({
            userId: input.reviewerId,
            delta: REVIEWER_REWARD,
            reason: 'Observation review',
            observationId: observation.id,
            status: 'REJECTED',
        }) ?? Promise.resolve(),
    ]);
    return updated;
}
