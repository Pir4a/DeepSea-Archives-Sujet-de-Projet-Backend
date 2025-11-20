
export type SpeciesStat = {
  speciesId: number;
  speciesName: string;
  totalObservations: number;
  averageDangerLevel: number;
  classification: string;
  topKeywords: string[];
};

export type TaxonomyStats = {
  totalSpecies: number;
  totalObservations: number;
  speciesStats: SpeciesStat[];
};

