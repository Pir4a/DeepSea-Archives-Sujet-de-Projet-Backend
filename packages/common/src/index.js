// Point d'entrée du package @deepsea/common

module.exports = {
  AppError: require('./lib/AppError'),
  logger: require('./lib/logger'),
  jwt: require('./lib/jwt'),
  // middlewares
  auth: require('./middlewares/authMiddleware'),
  errorHandler: require('./middlewares/errorHandler'),
  notFoundHandler: require('./middlewares/notFoundHandler'),
};



