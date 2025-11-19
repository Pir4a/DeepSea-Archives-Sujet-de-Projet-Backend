const AppError = require('../lib/AppError');
const logger = require('../lib/logger');

// Middleware d’erreur Express partagé
// À placer en dernier dans chaque microservice
function errorHandler(err, req, res, next) {
  if (!err) return next();

  const isAppError = err instanceof AppError;
  const statusCode = isAppError ? err.statusCode : 500;

  logger.error('request_error', {
    statusCode,
    path: req.path,
    method: req.method,
    message: err.message,
  });

  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    ...(isAppError && err.details ? { details: err.details } : {}),
  });
}

module.exports = errorHandler;


