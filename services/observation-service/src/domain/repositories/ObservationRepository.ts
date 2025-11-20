// Port de dépôt (repository) pour les Observations – interface côté domaine.

import type { ObservationProps, ObservationStatus } from '../entities/Observation';
import type {
  ObservationHistoryProps,
} from '../entities/ObservationHistory';

export type ObservationListOptions = {
  status?: ObservationStatus[];
  includeDeleted?: boolean;
};

export type ObservationHistoryListOptions = {
  speciesId?: number;
  observationId?: number;
  limit?: number;
};

export interface ObservationRepository {
  create(observation: ObservationProps): Promise<any>;
  findById(id: number): Promise<any | null>;
  findBySpeciesId(
    speciesId: number,
    options?: ObservationListOptions,
  ): Promise<any[]>;
  findLastBySpeciesAndAuthor(
    speciesId: number,
    authorId: number,
  ): Promise<any | null>;
  updateStatus(id: number, changes: any): Promise<any>;
  softDelete(id: number): Promise<any>;
  restore(id: number): Promise<any>;
  createHistoryEntry(entry: ObservationHistoryProps): Promise<any>;
  listHistory(options?: ObservationHistoryListOptions): Promise<any[]>;
  countActiveBySpecies(speciesId: number): Promise<number>;
}

