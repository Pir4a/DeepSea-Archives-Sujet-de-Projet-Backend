import { Response, NextFunction } from 'express';
import { auth, AppError } from '@deepsea/common';
import { AuthServiceClient } from '../../../infrastructure/services/AuthServiceClient';

const authServiceClient = new AuthServiceClient();

/**
 * Middleware that enriches the request user with fresh data from Auth Service
 * This is useful for critical operations where we need the latest role/reputation
 */
export const enrichUserFromAuthService = async (req: any, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return next();

  try {
    const userProfile = await authServiceClient.getUserProfile(token);
    if (userProfile) {
      // Override user payload with fresh data
      req.user = { ...req.user, ...userProfile };
    }
    next();
  } catch (error) {
    // Fail safe: continue with JWT payload or error out?
    // For now, log and continue, relying on JWT
    console.error('Failed to enrich user from Auth Service:', error);
    next();
  }
};

