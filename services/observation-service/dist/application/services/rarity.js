"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateRarityScore = calculateRarityScore;
exports.recalculateRarityForSpecies = recalculateRarityForSpecies;
function calculateRarityScore(observationCount) {
    const baseScore = 100;
    const score = baseScore / (1 + observationCount);
    return Number(Math.max(1, score).toFixed(2));
}
async function recalculateRarityForSpecies(speciesId, observationRepository, speciesRepository) {
    const count = await observationRepository.countActiveBySpecies(speciesId);
    const rarityScore = calculateRarityScore(count);
    await speciesRepository.updateRarityScore(speciesId, rarityScore);
    return rarityScore;
}
