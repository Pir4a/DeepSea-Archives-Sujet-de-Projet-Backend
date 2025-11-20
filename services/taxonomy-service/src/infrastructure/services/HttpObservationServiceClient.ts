import fetch from 'node-fetch';
import { ObservationServiceClient, Species, Observation } from '../../application/ports/ObservationServiceClient';

export class HttpObservationServiceClient implements ObservationServiceClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getAllSpecies(): Promise<Species[]> {
    try {
      // Assuming observation-service has an endpoint /species
      const response = await fetch(`${this.baseUrl}/species`);
      if (!response.ok) return [];
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching species:', error);
      return [];
    }
  }

  async getAllObservations(): Promise<Observation[]> {
    try {
      // Assuming observation-service has an endpoint /observations or we fetch by species
      // For now, let's assume there is an endpoint /observations to get all history
      // If not, we might need to fetch species first then observations per species.
      // Re-checking observation-service routes...
      // It has listObservationHistory.ts -> likely /observations
      const response = await fetch(`${this.baseUrl}/observations`);
      if (!response.ok) return [];
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching observations:', error);
      return [];
    }
  }
}

