"use strict";
// Use case : création d'une Species.
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = execute;
const common_1 = require("@deepsea/common");
const Species_1 = require("../../domain/entities/Species");
async function execute(deps, input) {
    const { speciesRepository } = deps;
    const trimmedName = input?.name?.trim();
    if (!trimmedName) {
        throw new common_1.AppError('Species name is required', 400);
    }
    const existing = await speciesRepository.findByName(trimmedName);
    if (existing) {
        throw new common_1.AppError('Species name must be unique', 409);
    }
    const species = (0, Species_1.createSpecies)({
        authorId: input.authorId,
        name: trimmedName,
    });
    return speciesRepository.create(species);
}
