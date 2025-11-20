// Use case : création d'une Observation.

import { AppError } from '@deepsea/common';
import { createObservation as createObservationEntity } from '../../domain/entities/Observation';
import type { ObservationRepository } from '../../domain/repositories/ObservationRepository';
import type { SpeciesRepository } from '../../domain/repositories/SpeciesRepository';
import { recalculateRarityForSpecies } from '../services/rarity';

const FIVE_MINUTES_MS = 5 * 60 * 1000;

export type CreateObservationDeps = {
  observationRepository: ObservationRepository;
  speciesRepository: SpeciesRepository;
};

export type CreateObservationInput = {
  speciesId: number;
  authorId: number;
  description: string;
  dangerLevel?: number;
};

export async function execute(
  deps: CreateObservationDeps,
  input: CreateObservationInput,
): Promise<any> {
  const { observationRepository, speciesRepository } = deps;
  const { speciesId, authorId } = input;

  if (!Number.isFinite(speciesId)) {
    throw new AppError('Valid speciesId is required', 400);
  }

  if (!Number.isFinite(authorId)) {
    throw new AppError('Valid authorId is required', 400);
  }

  const species = await speciesRepository.findById(speciesId);

  if (!species) {
    throw new AppError('Species not found', 404);
  }

  const description = input.description?.trim();
  if (!description) {
    throw new AppError('Description is required', 400);
  }

  const dangerLevel = input.dangerLevel ?? 1;
  if (!Number.isFinite(dangerLevel)) {
    throw new AppError('dangerLevel must be numeric', 400);
  }
  if (dangerLevel < 1 || dangerLevel > 5) {
    throw new AppError('dangerLevel must be between 1 and 5', 400);
  }

  const last = await observationRepository.findLastBySpeciesAndAuthor(
    speciesId,
    authorId,
  );

  if (last) {
    const elapsed = Date.now() - new Date(last.createdAt).getTime();
    if (elapsed < FIVE_MINUTES_MS) {
      throw new AppError(
        'You must wait 5 minutes before recording another observation for this species',
        400,
      );
    }
  }

  const observation = createObservationEntity({
    speciesId,
    authorId,
    description,
    dangerLevel,
  });

  const created = await observationRepository.create(observation);

  await observationRepository.createHistoryEntry({
    observationId: created.id,
    speciesId: created.speciesId,
    authorId: created.authorId,
    action: 'CREATED',
    payload: { dangerLevel: created.dangerLevel },
  });

  await recalculateRarityForSpecies(
    created.speciesId,
    observationRepository,
    speciesRepository,
  );

  return created;
}

