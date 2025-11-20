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
}

