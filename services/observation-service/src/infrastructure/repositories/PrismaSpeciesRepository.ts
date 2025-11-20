// Implémentation Prisma du port SpeciesRepository.

import { prisma } from '../prisma/client';
import type { SpeciesProps } from '../../domain/entities/Species';
import type { SpeciesListOptions } from '../../domain/repositories/SpeciesRepository';

export const PrismaSpeciesRepository = {
  async create(species: SpeciesProps) {
    const { id, ...rest } = species;
    return prisma.species.create({ data: rest as any });
  },

  async findById(id: number) {
    return prisma.species.findUnique({ where: { id: Number(id) } });
  },

  async findAll(options: SpeciesListOptions = {}) {
    const { sortBy = 'createdAt', order = 'desc', minRarity } = options;

    return prisma.species.findMany({
      where:
        typeof minRarity === 'number'
          ? {
              rarityScore: {
                gte: minRarity,
              },
            }
          : undefined,
      orderBy: {
        [sortBy]: order,
      },
    });
  },

  async findByName(name: string) {
    return prisma.species.findUnique({ where: { name } });
  },

  async updateRarityScore(id: number, rarityScore: number) {
    return prisma.species.update({
      where: { id: Number(id) },
      data: { rarityScore },
    });
  },
};

