import { getTaxonomyStats } from '../application/usecases/GetTaxonomyStats';

describe('Taxonomy Service Aggregation', () => {
  it('should aggregate stats correctly', async () => {
    const mockObsService = {
      getAllSpecies: jest.fn().mockResolvedValue([
        { id: 1, name: 'GlowSquid', rarityScore: 100 },
        { id: 2, name: 'RockCrab', rarityScore: 10 }
      ]),
      getAllObservations: jest.fn().mockResolvedValue([
        { speciesId: 1, dangerLevel: 5, description: 'Very dangerous and glowing' },
        { speciesId: 1, dangerLevel: 5, description: 'Just glowing' },
        { speciesId: 2, dangerLevel: 1, description: 'Small crab' }
      ])
    } as any;

    const useCase = getTaxonomyStats({ observationServiceClient: mockObsService });
    const result = await useCase();

    expect(result.totalSpecies).toBe(2);
    expect(result.totalObservations).toBe(3);
    
    const squidStats = result.speciesStats.find(s => s.speciesId === 1);
    expect(squidStats).toBeDefined();
    expect(squidStats?.totalObservations).toBe(2);
    // Avg Danger: (5+5)/2 = 5
    expect(squidStats?.averageDangerLevel).toBe(5);
    expect(squidStats?.classification).toBe('LEGENDARY'); 

    const crabStats = result.speciesStats.find(s => s.speciesId === 2);
    expect(crabStats).toBeDefined();
    expect(crabStats?.totalObservations).toBe(1);
    expect(crabStats?.averageDangerLevel).toBe(1);
  });
});

