"use strict";
// Use case : lister toutes les observations pour une espèce donnée.
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = execute;
const common_1 = require("@deepsea/common");
async function execute(deps, input) {
    const { speciesId, status, includeDeleted } = input;
    const species = await deps.speciesRepository.findById(speciesId);
    if (!species) {
        throw new common_1.AppError('Species not found', 404);
    }
    return deps.observationRepository.findBySpeciesId(speciesId, {
        status,
        includeDeleted,
    });
}
