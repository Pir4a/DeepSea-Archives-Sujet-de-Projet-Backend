// Implémentation Prisma du port ObservationRepository.

import { prisma } from '../prisma/client';
import type { ObservationProps } from '../../domain/entities/Observation';

export const PrismaObservationRepository = {
  async create(observation: ObservationProps) {
    return prisma.observation.create({ data: observation as any });
  },

  async findById(id: number) {
    return prisma.observation.findUnique({ where: { id: Number(id) } });
  },

  async findBySpeciesId(speciesId: number) {
    return prisma.observation.findMany({
      where: { speciesId: Number(speciesId) },
      orderBy: { createdAt: 'desc' },
    });
  },

  async findLastBySpeciesAndAuthor(speciesId: number, authorId: number) {
    return prisma.observation.findFirst({
      where: { speciesId: Number(speciesId), authorId: Number(authorId) },
      orderBy: { createdAt: 'desc' },
    });
  },

  async updateStatus(id: number, changes: any) {
    return prisma.observation.update({
      where: { id: Number(id) },
      data: changes,
    });
  },
};


