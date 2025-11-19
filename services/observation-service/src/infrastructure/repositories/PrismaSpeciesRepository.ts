// Implémentation Prisma du port SpeciesRepository.

import { prisma } from '../prisma/client';
import type { SpeciesProps } from '../../domain/entities/Species';

export const PrismaSpeciesRepository = {
  async create(species: SpeciesProps) {
    return prisma.species.create({ data: species as any });
  },

  async findById(id: number) {
    return prisma.species.findUnique({ where: { id: Number(id) } });
  },

  async findAll() {
    return prisma.species.findMany();
  },

  async findByName(name: string) {
    return prisma.species.findUnique({ where: { name } });
  },
};


