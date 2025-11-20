import { ObservationServiceClient, Species, Observation } from '../ports/ObservationServiceClient';
import { TaxonomyStats, SpeciesStat } from '../../domain/entities/TaxonomyStats';

export type GetTaxonomyStatsDeps = {
  observationServiceClient: ObservationServiceClient;
};

export const getTaxonomyStats = (deps: GetTaxonomyStatsDeps) => async (): Promise<TaxonomyStats> => {
  const speciesList = await deps.observationServiceClient.getAllSpecies();
  
  // Ideally we would get all observations. If we can't, we might iterate.
  // For now, let's assume getAllObservations works or returns what it can.
  const observations = await deps.observationServiceClient.getAllObservations();

  const speciesStatsMap = new Map<number, { 
    name: string, 
    obsCount: number, 
    totalDanger: number,
    descriptions: string[],
    rarity: number 
  }>();

  // Initialize map
  for (const s of speciesList) {
    speciesStatsMap.set(s.id, {
      name: s.name,
      obsCount: 0,
      totalDanger: 0,
      descriptions: [],
      rarity: s.rarityScore
    });
  }

  // Aggregate observations
  for (const obs of observations) {
    const stat = speciesStatsMap.get(obs.speciesId);
    if (stat) {
      stat.obsCount++;
      stat.totalDanger += obs.dangerLevel;
      stat.descriptions.push(obs.description);
    }
  }

  const speciesStats: SpeciesStat[] = [];
  let totalObservations = 0;

  for (const [id, stat] of speciesStatsMap.entries()) {
    totalObservations += stat.obsCount;
    const avgDanger = stat.obsCount > 0 ? stat.totalDanger / stat.obsCount : 0;
    
    // Classification Heuristics
    // Example: High Danger + High Rarity = LEGENDARY
    // Low Danger + Low Rarity = COMMON
    let classification = 'COMMON';
    if (stat.rarity > 80 && avgDanger > 4) {
      classification = 'LEGENDARY';
    } else if (stat.rarity > 60 || avgDanger > 3) {
      classification = 'RARE';
    } else if (avgDanger > 2) {
      classification = 'DANGEROUS';
    } else {
      classification = 'SAFE';
    }

    // Simple TF-IDF / Keyword extraction (simplified)
    const keywords = extractKeywords(stat.descriptions);

    speciesStats.push({
      speciesId: id,
      speciesName: stat.name,
      totalObservations: stat.obsCount,
      averageDangerLevel: avgDanger,
      classification,
      topKeywords: keywords
    });
  }

  return {
    totalSpecies: speciesList.length,
    totalObservations,
    speciesStats
  };
};

// Simplified keyword extraction (just frequency count for now)
function extractKeywords(descriptions: string[]): string[] {
  const wordCounts = new Map<string, number>();
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'is', 'of', 'with', 'it', 'this', 'that']);

  for (const desc of descriptions) {
    const words = desc.toLowerCase().split(/\W+/);
    for (const w of words) {
      if (w.length > 2 && !stopWords.has(w)) {
        wordCounts.set(w, (wordCounts.get(w) || 0) + 1);
      }
    }
  }

  return Array.from(wordCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(entry => entry[0]);
}

