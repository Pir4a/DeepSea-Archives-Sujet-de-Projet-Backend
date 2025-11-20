import { calculateRarityScore } from '../application/services/rarity';

describe('Rarity Calculation Formula', () => {
  it('should follow formula: 1 + (valid_observations / 5)', () => {
    // 0 observations => 1 + 0 = 1
    expect(calculateRarityScore(0)).toBe(1);

    // 5 observations => 1 + 1 = 2
    expect(calculateRarityScore(5)).toBe(2);

    // 10 observations => 1 + 2 = 3
    expect(calculateRarityScore(10)).toBe(3);

    // 12 observations => 1 + 2.4 = 3.4
    expect(calculateRarityScore(12)).toBe(3.4);
  });
});

