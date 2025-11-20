// Use case : création d'une Species.

import { AppError } from '@deepsea/common';
import { createSpecies as createSpeciesEntity } from '../../domain/entities/Species';
import type { SpeciesRepository } from '../../domain/repositories/SpeciesRepository';

export type CreateSpeciesInput = {
  authorId: number;
  name: string;
};

export type CreateSpeciesDeps = {
  speciesRepository: SpeciesRepository;
};

export async function execute(
  deps: CreateSpeciesDeps,
  input: CreateSpeciesInput,
): Promise<any> {
  const { speciesRepository } = deps;
  const trimmedName = input?.name?.trim();

  if (!trimmedName) {
    throw new AppError('Species name is required', 400);
  }

  const existing = await speciesRepository.findByName(trimmedName);
  if (existing) {
    throw new AppError('Species name must be unique', 409);
  }

  const species = createSpeciesEntity({
    authorId: input.authorId,
    name: trimmedName,
  });

  return speciesRepository.create(species);
}

