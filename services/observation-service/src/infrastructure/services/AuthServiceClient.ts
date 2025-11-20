import fetch from 'node-fetch';
import { logger } from '@deepsea/common';
import type {
  AuthServicePort,
  ReputationEvent,
} from '../../application/ports/AuthServicePort';

export class AuthServiceClient implements AuthServicePort {
  private readonly baseUrl: string | null;

  constructor(baseUrl = process.env.AUTH_SERVICE_URL) {
    this.baseUrl = baseUrl ?? null;
  }

  async sendReputationDelta(event: ReputationEvent): Promise<void> {
    if (!this.baseUrl) {
      logger.debug('auth_service_url_missing', {
        reason: 'No AUTH_SERVICE_URL configured',
      });
      return;
    }

    try {
      // Updated to point to /internal/reputation route which we will create
      const response = await fetch(`${this.baseUrl}/internal/reputation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-service-name': 'observation-service',
        },
        body: JSON.stringify(event),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `HTTP ${response.status}`);
      }
    } catch (error) {
      logger.warn('auth_service_reputation_failed', {
        message: (error as Error).message,
        event,
      });
    }
  }

  async getUserProfile(token: string): Promise<{ id: number; role: string; reputation: number } | null> {
    if (!this.baseUrl) return null;
    try {
      const response = await fetch(`${this.baseUrl}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      logger.error('auth_service_profile_check_failed', { error });
      return null;
    }
  }
}
