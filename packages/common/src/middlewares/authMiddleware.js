const { verifyToken } = require('../lib/jwt');
const AppError = require('../lib/AppError');

/**
 * Middleware d'authentification générique.
 * - Lit le header Authorization: Bearer <token>
 * - Vérifie le JWT
 * - Place le payload dans req.user
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(new AppError('Authentication required', 401));
  }

  try {
    const payload = verifyToken(token);
    req.user = payload;
    return next();
  } catch (err) {
    return next(err);
  }
}

/**
 * Middleware de vérification de rôle (USER, EXPERT, ADMIN, etc.)
 * Exemple d'utilisation: app.get('/admin', authMiddleware, requireRole('ADMIN'), handler)
 */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError('Forbidden', 403));
    }
    return next();
  };
}

module.exports = {
  authMiddleware,
  requireRole,
};


