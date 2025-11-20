// Use case : récupérer une Species par id.

import { AppError } from '@deepsea/common';
import type { SpeciesRepository } from '../../domain/repositories/SpeciesRepository';

export type GetSpeciesDeps = {
  speciesRepository: SpeciesRepository;
};

export type GetSpeciesInput = {
  id: number;
};

export async function execute(
  deps: GetSpeciesDeps,
  input: GetSpeciesInput,
): Promise<any> {
  const species = await deps.speciesRepository.findById(input.id);
  if (!species) {
    throw new AppError('Species not found', 404);
  }

  return species;
}

