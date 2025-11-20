// Use case : lister toutes les Species, avec tri par rarityScore optionnel.

import type {
  SpeciesListOptions,
  SpeciesRepository,
} from '../../domain/repositories/SpeciesRepository';

export type ListSpeciesDeps = {
  speciesRepository: SpeciesRepository;
};

export type ListSpeciesInput = {
  sortBy?: SpeciesListOptions['sortBy'];
  order?: SpeciesListOptions['order'];
  minRarity?: number;
};

export async function execute(
  deps: ListSpeciesDeps,
  input: ListSpeciesInput = {},
): Promise<any[]> {
  const { sortBy, order, minRarity } = input;
  const options: SpeciesListOptions = {};

  if (sortBy) {
    options.sortBy = sortBy;
  }
  if (order) {
    options.order = order;
  }
  if (typeof minRarity === 'number' && !Number.isNaN(minRarity)) {
    options.minRarity = minRarity;
  }

  return deps.speciesRepository.findAll(options);
}

