import type { SpeciesRepository } from '../domain/repositories/SpeciesRepository';
import type { ObservationRepository } from '../domain/repositories/ObservationRepository';
import type { AuthServicePort } from './ports/AuthServicePort';

export type ObservationServiceDeps = {
  speciesRepository: SpeciesRepository;
  observationRepository: ObservationRepository;
  authService?: AuthServicePort;
};

