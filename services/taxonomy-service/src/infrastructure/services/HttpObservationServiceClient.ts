import fetch from 'node-fetch';
import { ObservationServiceClient, Species, Observation } from '../../application/ports/ObservationServiceClient';

export class HttpObservationServiceClient implements ObservationServiceClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getAllSpecies(): Promise<Species[]> {
    try {
      const response = await fetch(`${this.baseUrl}/species`);
      if (!response.ok) {
        console.error(`Failed to fetch species: ${response.status} ${response.statusText}`);
        return [];
      }
      
      const body = await response.json() as any;
      // Unwrap { status: 'success', data: [...] }
      if (body && body.status === 'success' && Array.isArray(body.data)) {
        return body.data;
      }
      
      // Fallback if format is different
      return Array.isArray(body) ? body : [];
    } catch (error) {
      console.error('Error fetching species:', error);
      return [];
    }
  }

  async getAllObservations(): Promise<Observation[]> {
    try {
      // Strategy: Fetch all species first, then fetch observations for each species.
      // This avoids the need for an authenticated /observations/history endpoint for now.
      // Note: This is N+1 and should be optimized by adding a proper bulk endpoint later.
      
      const speciesList = await this.getAllSpecies();
      const allObservations: Observation[] = [];

      // Run in parallel
      const observationPromises = speciesList.map(async (species) => {
        try {
          const response = await fetch(`${this.baseUrl}/species/${species.id}/observations`);
          if (!response.ok) return [];
          
          const body = await response.json() as any;
          if (body && body.status === 'success' && Array.isArray(body.data)) {
            return body.data;
          }
          return [];
        } catch (err) {
          console.error(`Error fetching observations for species ${species.id}:`, err);
          return [];
        }
      });

      const results = await Promise.all(observationPromises);
      
      results.forEach(obsList => {
        allObservations.push(...obsList);
      });

      return allObservations;
    } catch (error) {
      console.error('Error fetching observations:', error);
      return [];
    }
  }
}
