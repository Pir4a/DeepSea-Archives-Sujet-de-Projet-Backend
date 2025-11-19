import { verifyToken } from '../lib/jwt';
import AppError from '../lib/AppError';

/**
 * Middleware d'authentification générique.
 * - Lit le header Authorization: Bearer <token>
 * - Vérifie le JWT
 * - Place le payload dans req.user
 */
export function authMiddleware(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(new AppError('Authentication required', 401));
  }

  try {
    const payload = verifyToken(token);
    (req as any).user = payload;
    return next();
  } catch (err) {
    return next(err);
  }
}

/**
 * Middleware de vérification de rôle (USER, EXPERT, ADMIN, etc.)
 * Exemple d'utilisation: app.get('/admin', authMiddleware, requireRole('ADMIN'), handler)
 */
export function requireRole(...allowedRoles: string[]) {
  return (req: any, res: any, next: any) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError('Forbidden', 403));
    }
    return next();
  };
}


