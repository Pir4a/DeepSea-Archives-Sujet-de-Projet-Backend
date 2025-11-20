import type { Request, Response, NextFunction } from 'express';
import { AppError } from '@deepsea/common';
import { ObservationServiceDeps } from '../../../application/types';
import type { ObservationStatus } from '../../../domain/entities/Observation';
import * as createObservationUseCase from '../../../application/usecases/createObservation';
import * as listObservationsUseCase from '../../../application/usecases/listObservationsForSpecies';
import * as validateObservationUseCase from '../../../application/usecases/validateObservation';
import * as rejectObservationUseCase from '../../../application/usecases/rejectObservation';
import * as listHistoryUseCase from '../../../application/usecases/listObservationHistory';
import * as deleteObservationUseCase from '../../../application/usecases/deleteObservation';
import * as restoreObservationUseCase from '../../../application/usecases/restoreObservation';

const VALID_STATUSES: ObservationStatus[] = ['PENDING', 'VALIDATED', 'REJECTED'];
const STATUS_SET = new Set(VALID_STATUSES);

function ensureAuthenticatedUser(req: Request) {
  if (!req.user?.id) {
    throw new AppError('Authenticated user required', 401);
  }
  return req.user;
}

function parseObservationId(req: Request) {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    throw new AppError('Invalid observation id', 400);
  }
  return id;
}

function parseOptionalNumber(value: unknown) {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}

export function createObservation(deps: ObservationServiceDeps) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = ensureAuthenticatedUser(req);
      const speciesId = Number(req.body?.speciesId);
      if (Number.isNaN(speciesId)) {
        throw new AppError('speciesId is required', 400);
      }

      const dangerLevelRaw = req.body?.dangerLevel;
      const dangerLevel =
        dangerLevelRaw === undefined || dangerLevelRaw === null
          ? undefined
          : Number(dangerLevelRaw);

      const observation = await createObservationUseCase.execute(
        {
          observationRepository: deps.observationRepository,
          speciesRepository: deps.speciesRepository,
        },
        {
          speciesId,
          authorId: Number(user.id),
          description: req.body?.description,
          dangerLevel,
        },
      );

      res.status(201).json({ status: 'success', data: observation });
    } catch (error) {
      next(error);
    }
  };
}

export function listObservationsForSpecies(deps: ObservationServiceDeps) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const speciesId = Number(req.params.id);
      if (Number.isNaN(speciesId)) {
        throw new AppError('Invalid species id', 400);
      }

      const statusParam = req.query.status;
      const status =
        typeof statusParam === 'string'
          ? (statusParam
              .split(',')
              .map((value) => value.trim().toUpperCase() as ObservationStatus)
              .filter((value) => STATUS_SET.has(value)) as ObservationStatus[])
          : undefined;
      const includeDeleted = req.query.includeDeleted === 'true';

      const observations = await listObservationsUseCase.execute(
        {
          observationRepository: deps.observationRepository,
          speciesRepository: deps.speciesRepository,
        },
        {
          speciesId,
          status,
          includeDeleted,
        },
      );

      res.json({ status: 'success', data: observations });
    } catch (error) {
      next(error);
    }
  };
}

export function validateObservation(deps: ObservationServiceDeps) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = ensureAuthenticatedUser(req);
      const observationId = parseObservationId(req);

      const observation = await validateObservationUseCase.execute(
        {
          observationRepository: deps.observationRepository,
          authService: deps.authService,
        },
        {
          observationId,
          validatorId: Number(user.id),
        },
      );

      res.json({ status: 'success', data: observation });
    } catch (error) {
      next(error);
    }
  };
}

export function rejectObservation(deps: ObservationServiceDeps) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = ensureAuthenticatedUser(req);
      const observationId = parseObservationId(req);

      const observation = await rejectObservationUseCase.execute(
        {
          observationRepository: deps.observationRepository,
          authService: deps.authService,
        },
        {
          observationId,
          reviewerId: Number(user.id),
          reason: req.body?.reason,
        },
      );

      res.json({ status: 'success', data: observation });
    } catch (error) {
      next(error);
    }
  };
}

export function listObservationHistory(deps: ObservationServiceDeps) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const history = await listHistoryUseCase.execute(
        {
          observationRepository: deps.observationRepository,
          speciesRepository: deps.speciesRepository,
        },
        {
          speciesId: parseOptionalNumber(req.query.speciesId),
          observationId: parseOptionalNumber(req.query.observationId),
          limit: parseOptionalNumber(req.query.limit),
        },
      );

      res.json({ status: 'success', data: history });
    } catch (error) {
      next(error);
    }
  };
}

export function deleteObservation(deps: ObservationServiceDeps) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = ensureAuthenticatedUser(req);
      const observationId = parseObservationId(req);

      const deleted = await deleteObservationUseCase.execute(
        {
          observationRepository: deps.observationRepository,
          speciesRepository: deps.speciesRepository,
        },
        {
          observationId,
          performedBy: Number(user.id),
        },
      );

      res.json({ status: 'success', data: deleted });
    } catch (error) {
      next(error);
    }
  };
}

export function restoreObservation(deps: ObservationServiceDeps) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = ensureAuthenticatedUser(req);
      const observationId = parseObservationId(req);

      const restored = await restoreObservationUseCase.execute(
        {
          observationRepository: deps.observationRepository,
          speciesRepository: deps.speciesRepository,
        },
        {
          observationId,
          performedBy: Number(user.id),
        },
      );

      res.json({ status: 'success', data: restored });
    } catch (error) {
      next(error);
    }
  };
}

