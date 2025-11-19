import jwt, { SignOptions } from 'jsonwebtoken';
import AppError from './AppError';

function getSecret(): string {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment');
  }
  return process.env.JWT_SECRET;
}

export function signPayload(payload: any, options: SignOptions = {}): string {
  const secret = getSecret();
  const defaultOptions: SignOptions = { expiresIn: '1h' };
  return jwt.sign(payload, secret, { ...defaultOptions, ...options });
}

export function verifyToken(token: string): any {
  try {
    const secret = getSecret();
    return jwt.verify(token, secret);
  } catch {
    throw new AppError('Invalid or expired token', 401);
  }
}


