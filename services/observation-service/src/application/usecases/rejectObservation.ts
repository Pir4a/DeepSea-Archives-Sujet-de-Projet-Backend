// Use case : rejet d'une Observation.

import { AppError } from '@deepsea/common';
import type { ObservationRepository } from '../../domain/repositories/ObservationRepository';
import type { AuthServicePort } from '../ports/AuthServicePort';

const AUTHOR_PENALTY = -2;
const REVIEWER_REWARD = 1;

export type RejectObservationDeps = {
  observationRepository: ObservationRepository;
  authService?: AuthServicePort;
};

export type RejectObservationInput = {
  observationId: number;
  reviewerId: number;
  reason?: string;
};

export async function execute(
  deps: RejectObservationDeps,
  input: RejectObservationInput,
): Promise<any> {
  const { observationRepository, authService } = deps;
  const observation = await observationRepository.findById(input.observationId);

  if (!observation || observation.deletedAt) {
    throw new AppError('Observation not found', 404);
  }

  if (observation.status !== 'PENDING') {
    throw new AppError('Observation already reviewed', 409);
  }

  if (observation.authorId === input.reviewerId) {
    throw new AppError('You cannot review your own observation', 403);
  }

  const updated = await observationRepository.updateStatus(observation.id, {
    status: 'REJECTED',
    validatedBy: input.reviewerId,
    validatedAt: new Date(),
  });

  await observationRepository.createHistoryEntry({
    observationId: observation.id,
    speciesId: observation.speciesId,
    authorId: observation.authorId,
    performedBy: input.reviewerId,
    action: 'REJECTED',
    payload: {
      reason: input.reason ?? null,
      previousStatus: observation.status,
    },
  });

  await Promise.all([
    authService?.sendReputationDelta({
      userId: observation.authorId,
      delta: AUTHOR_PENALTY,
      reason: input.reason || 'Observation rejected',
      observationId: observation.id,
      status: 'REJECTED',
    }) ?? Promise.resolve(),
    authService?.sendReputationDelta({
      userId: input.reviewerId,
      delta: REVIEWER_REWARD,
      reason: 'Observation review',
      observationId: observation.id,
      status: 'REJECTED',
    }) ?? Promise.resolve(),
  ]);

  return updated;
}

