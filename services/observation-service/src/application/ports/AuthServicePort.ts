import type { ObservationStatus } from '../../domain/entities/Observation';

export type ReputationEvent = {
  userId: number;
  delta: number;
  reason: string;
  observationId?: number;
  status?: ObservationStatus;
};

export interface AuthServicePort {
  sendReputationDelta(event: ReputationEvent): Promise<void>;
}

