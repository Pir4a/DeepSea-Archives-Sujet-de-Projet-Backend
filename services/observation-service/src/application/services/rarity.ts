import type { ObservationRepository } from '../../domain/repositories/ObservationRepository';
import type { SpeciesRepository } from '../../domain/repositories/SpeciesRepository';

export function calculateRarityScore(observationCount: number): number {
  const baseScore = 100;
  const score = baseScore / (1 + observationCount);
  return Number(Math.max(1, score).toFixed(2));
}

export async function recalculateRarityForSpecies(
  speciesId: number,
  observationRepository: ObservationRepository,
  speciesRepository: SpeciesRepository,
) {
  const count = await observationRepository.countActiveBySpecies(speciesId);
  const rarityScore = calculateRarityScore(count);
  await speciesRepository.updateRarityScore(speciesId, rarityScore);
  return rarityScore;
}

