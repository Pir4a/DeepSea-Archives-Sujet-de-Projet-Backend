import type { ObservationRepository } from '../../domain/repositories/ObservationRepository';
import type { SpeciesRepository } from '../../domain/repositories/SpeciesRepository';

export function calculateRarityScore(observationCount: number): number {
  // Formula: rarityScore = (1 + nombreObservationsValidées / 5)
  const score = 1 + (observationCount / 5);
  return Number(score.toFixed(2));
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

