"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = execute;
const common_1 = require("@deepsea/common");
async function execute(deps, input) {
    const { speciesId, observationId, limit } = input;
    if (speciesId) {
        const exists = await deps.speciesRepository.findById(speciesId);
        if (!exists) {
            throw new common_1.AppError('Species not found', 404);
        }
    }
    if (observationId) {
        const obs = await deps.observationRepository.findById(observationId);
        if (!obs) {
            throw new common_1.AppError('Observation not found', 404);
        }
    }
    return deps.observationRepository.listHistory({ speciesId, observationId, limit });
}
