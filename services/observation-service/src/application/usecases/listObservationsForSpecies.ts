// Use case : lister toutes les observations pour une espèce donnée.

import type { ObservationStatus } from '../../domain/entities/Observation';
import type { ObservationRepository } from '../../domain/repositories/ObservationRepository';
import type { SpeciesRepository } from '../../domain/repositories/SpeciesRepository';
import { AppError } from '@deepsea/common';

export type ListObservationsDeps = {
  observationRepository: ObservationRepository;
  speciesRepository: SpeciesRepository;
};

export type ListObservationsInput = {
  speciesId: number;
  status?: ObservationStatus[];
  includeDeleted?: boolean;
};

export async function execute(
  deps: ListObservationsDeps,
  input: ListObservationsInput,
): Promise<any[]> {
  const { speciesId, status, includeDeleted } = input;
  const species = await deps.speciesRepository.findById(speciesId);

  if (!species) {
    throw new AppError('Species not found', 404);
  }

  return deps.observationRepository.findBySpeciesId(speciesId, {
    status,
    includeDeleted,
  });
}

