// Port de dépôt (repository) pour les Observations – interface côté domaine.

import type { ObservationProps } from '../entities/Observation';

export interface ObservationRepository {
  create(observation: ObservationProps): Promise<any>;
  findById(id: number): Promise<any | null>;
  findBySpeciesId(speciesId: number): Promise<any[]>;
  findLastBySpeciesAndAuthor(
    speciesId: number,
    authorId: number,
  ): Promise<any | null>;
  updateStatus(id: number, changes: any): Promise<any>;
}


