import AppError from '../lib/AppError';
import logger from '../lib/logger';

// Middleware d’erreur Express partagé
// À placer en dernier dans chaque microservice
export default function errorHandler(err: any, req: any, res: any, next: any) {
  if (!err) return next();

  const isAppError = err instanceof AppError;
  const statusCode = isAppError ? (err as AppError).statusCode : 500;

  logger.error('request_error', {
    statusCode,
    path: req.path,
    method: req.method,
    message: err.message,
  });

  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    ...(isAppError && (err as AppError).details ? { details: (err as AppError).details } : {}),
  });
}


