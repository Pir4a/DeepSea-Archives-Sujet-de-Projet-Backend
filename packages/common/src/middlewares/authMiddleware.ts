import { verifyToken } from '../lib/jwt';
import AppError from '../lib/AppError';
import fetch from 'node-fetch';

// Extend request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

/**
 * Middleware d'authentification générique.
 * - Lit le header Authorization: Bearer <token>
 * - Vérifie le JWT
 * - Place le payload dans req.user
 * - Optionnel: valide le token auprès du service d'auth
 */
export function authMiddleware(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');

  // Exempt swagger docs from auth
  if (req.path.startsWith('/api-docs')) {
    return next();
  }

  if (scheme !== 'Bearer' || !token) {
    return next(new AppError('Authentication required', 401));
  }

  try {
    const payload = verifyToken(token);
    (req as any).user = payload;
    
    // Note: Ideally we would validate against auth service here if token revocation is needed
    // but for performance we trust the JWT signature + expiration for basic auth.
    // Role checks might need fresher data depending on policy.
    
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
