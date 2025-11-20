import { AppError } from '@deepsea/common';
import type { ObservationRepository } from '../../domain/repositories/ObservationRepository';
import type { SpeciesRepository } from '../../domain/repositories/SpeciesRepository';
import { recalculateRarityForSpecies } from '../services/rarity';

export type DeleteObservationDeps = {
  observationRepository: ObservationRepository;
  speciesRepository: SpeciesRepository;
};

export type DeleteObservationInput = {
  observationId: number;
  performedBy: number;
};

export async function execute(
  deps: DeleteObservationDeps,
  input: DeleteObservationInput,
) {
  const { observationRepository, speciesRepository } = deps;
  const observation = await observationRepository.findById(input.observationId);

  if (!observation) {
    throw new AppError('Observation not found', 404);
  }

  if (observation.deletedAt) {
    throw new AppError('Observation already deleted', 409);
  }

  const deleted = await observationRepository.softDelete(observation.id);

  await observationRepository.createHistoryEntry({
    observationId: observation.id,
    speciesId: observation.speciesId,
    authorId: observation.authorId,
    performedBy: input.performedBy,
    action: 'DELETED',
    payload: {
      status: observation.status,
    },
  });

  await recalculateRarityForSpecies(
    observation.speciesId,
    observationRepository,
    speciesRepository,
  );

  return deleted;
}

