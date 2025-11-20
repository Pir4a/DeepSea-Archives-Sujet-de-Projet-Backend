import { AppError } from '@deepsea/common';
import type { ObservationRepository } from '../../domain/repositories/ObservationRepository';
import type { SpeciesRepository } from '../../domain/repositories/SpeciesRepository';

export type ListObservationHistoryDeps = {
  observationRepository: ObservationRepository;
  speciesRepository: SpeciesRepository;
};

export type ListObservationHistoryInput = {
  speciesId?: number;
  observationId?: number;
  limit?: number;
};

export async function execute(
  deps: ListObservationHistoryDeps,
  input: ListObservationHistoryInput,
) {
  const { speciesId, observationId, limit } = input;

  if (speciesId) {
    const exists = await deps.speciesRepository.findById(speciesId);
    if (!exists) {
      throw new AppError('Species not found', 404);
    }
  }

  if (observationId) {
    const obs = await deps.observationRepository.findById(observationId);
    if (!obs) {
      throw new AppError('Observation not found', 404);
    }
  }

  return deps.observationRepository.listHistory({ speciesId, observationId, limit });
}

