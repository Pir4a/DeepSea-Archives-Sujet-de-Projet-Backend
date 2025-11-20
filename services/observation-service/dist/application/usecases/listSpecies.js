"use strict";
// Use case : lister toutes les Species, avec tri par rarityScore optionnel.
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = execute;
async function execute(deps, input = {}) {
    const { sortBy, order, minRarity } = input;
    const options = {};
    if (sortBy) {
        options.sortBy = sortBy;
    }
    if (order) {
        options.order = order;
    }
    if (typeof minRarity === 'number' && !Number.isNaN(minRarity)) {
        options.minRarity = minRarity;
    }
    return deps.speciesRepository.findAll(options);
}
