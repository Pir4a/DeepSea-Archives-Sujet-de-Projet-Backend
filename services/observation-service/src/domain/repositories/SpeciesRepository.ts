// Port de dépôt (repository) pour les Species – interface côté domaine.
// L’implémentation concrète (Prisma, etc.) sera dans infrastructure.

import type { SpeciesProps } from '../entities/Species';

export interface SpeciesRepository {
  create(species: SpeciesProps): Promise<any>;
  findById(id: number): Promise<any | null>;
  findAll(): Promise<any[]>;
  findByName(name: string): Promise<any | null>;
}


