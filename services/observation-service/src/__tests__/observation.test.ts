import { execute, CreateObservationDeps } from '../application/usecases/createObservation';

// Mock Rarity Service
jest.mock('../application/services/rarity', () => ({
  recalculateRarityForSpecies: jest.fn(),
}));

describe('Observation Service Logic', () => {
  describe('5-Minute Delay Rule', () => {
    const mockObsRepo = {
      findLastBySpeciesAndAuthor: jest.fn(),
      create: jest.fn(),
      createHistoryEntry: jest.fn(),
    } as any;

    const mockSpeciesRepo = {
      findById: jest.fn(),
    } as any;

    const deps: CreateObservationDeps = {
      observationRepository: mockObsRepo,
      speciesRepository: mockSpeciesRepo,
    };

    const input = {
      speciesId: 1,
      authorId: 1,
      description: 'Test desc',
      dangerLevel: 1,
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should throw error if last observation was < 5 mins ago', async () => {
      mockSpeciesRepo.findById.mockResolvedValue({ id: 1 });
      
      // Last observation was 1 minute ago
      mockObsRepo.findLastBySpeciesAndAuthor.mockResolvedValue({
        id: 100,
        createdAt: new Date(Date.now() - 60 * 1000), 
      });

      await expect(execute(deps, input)).rejects.toThrow('You must wait 5 minutes');
    });

    it('should allow observation if last observation was > 5 mins ago', async () => {
      mockSpeciesRepo.findById.mockResolvedValue({ id: 1 });
      
      // Last observation was 10 minutes ago
      mockObsRepo.findLastBySpeciesAndAuthor.mockResolvedValue({
        id: 100,
        createdAt: new Date(Date.now() - 10 * 60 * 1000), 
      });

      mockObsRepo.create.mockResolvedValue({
        id: 101,
        speciesId: 1,
        authorId: 1,
        dangerLevel: 1,
      });

      await expect(execute(deps, input)).resolves.not.toThrow();
    });
  });

  describe('Rarity Calculation', () => {
    // We need to test the actual calculateRarityScore function or logic
    // Since we mocked the module above for the usecase test, let's re-import the actual function for this test
    // Or we can implement a separate test file. For simplicity, I'll duplicate the logic here or test the module directly in a separate describe block
    // but I need to unmock it first. Jest hoisting makes this tricky in the same file.
    // I will use a separate file approach or just test the formula manually here.
    
    // Actually, let's just verify the formula implementation in rarity.ts by reading it?
    // No, I should write a test for it. 
    // I'll just write a separate test file for Rarity to avoid module mocking conflicts.
  });
});

