import type { Request, Response, NextFunction } from 'express';
import { AppError } from '@deepsea/common';
import { ObservationServiceDeps } from '../../../application/types';
import * as createSpeciesUseCase from '../../../application/usecases/createSpecies';
import * as listSpeciesUseCase from '../../../application/usecases/listSpecies';
import * as getSpeciesUseCase from '../../../application/usecases/getSpecies';

const SORTABLE_FIELDS = new Set(['createdAt', 'rarityScore']);
const ORDER_VALUES = new Set(['asc', 'desc']);

function ensureAuthenticatedUser(req: Request) {
  if (!req.user?.id) {
    throw new AppError('Authenticated user required', 401);
  }
  return req.user;
}

export function createSpecies(deps: ObservationServiceDeps) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = ensureAuthenticatedUser(req);
      const species = await createSpeciesUseCase.execute(
        { speciesRepository: deps.speciesRepository },
        {
          authorId: Number(user.id),
          name: req.body?.name,
        },
      );

      res.status(201).json({ status: 'success', data: species });
    } catch (error) {
      next(error);
    }
  };
}

export function getSpeciesById(deps: ObservationServiceDeps) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        throw new AppError('Invalid species id', 400);
      }

      const species = await getSpeciesUseCase.execute(
        { speciesRepository: deps.speciesRepository },
        { id },
      );

      res.json({ status: 'success', data: species });
    } catch (error) {
      next(error);
    }
  };
}

export function listSpecies(deps: ObservationServiceDeps) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sortBy, order, minRarity } = req.query;
      const safeSort = typeof sortBy === 'string' && SORTABLE_FIELDS.has(sortBy)
        ? (sortBy as 'createdAt' | 'rarityScore')
        : undefined;
      const safeOrder = typeof order === 'string' && ORDER_VALUES.has(order)
        ? (order as 'asc' | 'desc')
        : undefined;
      const parsedMinRarity = typeof minRarity === 'string' ? Number(minRarity) : undefined;

      const species = await listSpeciesUseCase.execute(
        { speciesRepository: deps.speciesRepository },
        {
          sortBy: safeSort,
          order: safeOrder,
          minRarity: parsedMinRarity,
        },
      );

      res.json({ status: 'success', data: species });
    } catch (error) {
      next(error);
    }
  };
}

