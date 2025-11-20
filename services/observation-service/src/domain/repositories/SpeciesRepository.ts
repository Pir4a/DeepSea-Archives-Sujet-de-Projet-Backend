// Port de dépôt (repository) pour les Species – interface côté domaine.
// L’implémentation concrète (Prisma, etc.) sera dans infrastructure.

import type { SpeciesProps } from '../entities/Species';

export type SpeciesListOptions = {
  sortBy?: 'createdAt' | 'rarityScore';
  order?: 'asc' | 'desc';
  minRarity?: number;
};

export interface SpeciesRepository {
  create(species: SpeciesProps): Promise<any>;
  findById(id: number): Promise<any | null>;
  findAll(options?: SpeciesListOptions): Promise<any[]>;
  findByName(name: string): Promise<any | null>;
  updateRarityScore(id: number, rarityScore: number): Promise<any>;
}

