"use strict";
// Use case : récupérer une Species par id.
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = execute;
const common_1 = require("@deepsea/common");
async function execute(deps, input) {
    const species = await deps.speciesRepository.findById(input.id);
    if (!species) {
        throw new common_1.AppError('Species not found', 404);
    }
    return species;
}
