import { AppError } from '@deepsea/common';
import type { ObservationRepository } from '../../domain/repositories/ObservationRepository';
import type { SpeciesRepository } from '../../domain/repositories/SpeciesRepository';
import { recalculateRarityForSpecies } from '../services/rarity';

export type RestoreObservationDeps = {
  observationRepository: ObservationRepository;
  speciesRepository: SpeciesRepository;
};

export type RestoreObservationInput = {
  observationId: number;
  performedBy: number;
};

export async function execute(
  deps: RestoreObservationDeps,
  input: RestoreObservationInput,
) {
  const { observationRepository, speciesRepository } = deps;
  const observation = await observationRepository.findById(input.observationId);

  if (!observation) {
    throw new AppError('Observation not found', 404);
  }

  if (!observation.deletedAt) {
    throw new AppError('Observation is not deleted', 409);
  }

  const restored = await observationRepository.restore(observation.id);

  await observationRepository.createHistoryEntry({
    observationId: observation.id,
    speciesId: observation.speciesId,
    authorId: observation.authorId,
    performedBy: input.performedBy,
    action: 'RESTORED',
    payload: {
      status: observation.status,
    },
  });

  await recalculateRarityForSpecies(
    observation.speciesId,
    observationRepository,
    speciesRepository,
  );

  return restored;
}

