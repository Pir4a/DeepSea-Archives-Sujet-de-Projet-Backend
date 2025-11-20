
export interface Species {
  id: number;
  name: string;
  rarityScore: number;
}

export interface Observation {
  id: number;
  speciesId: number;
  description: string;
  dangerLevel: number;
}

export interface ObservationServiceClient {
  getAllSpecies(): Promise<Species[]>;
  getAllObservations(): Promise<Observation[]>;
}

