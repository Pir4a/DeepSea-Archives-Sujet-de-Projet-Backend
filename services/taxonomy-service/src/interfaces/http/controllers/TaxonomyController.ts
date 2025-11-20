import { Request, Response, NextFunction } from 'express';
import { GetTaxonomyStatsDeps, getTaxonomyStats } from '../../../application/usecases/GetTaxonomyStats';

export const getStats = (deps: GetTaxonomyStatsDeps) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const stats = await getTaxonomyStats(deps)();
    res.json({
      status: 'success',
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

