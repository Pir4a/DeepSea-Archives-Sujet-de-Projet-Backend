"use strict";
// Implémentation Prisma du port ObservationRepository.
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaObservationRepository = void 0;
const client_1 = require("../prisma/client");
exports.PrismaObservationRepository = {
    async create(observation) {
        return client_1.prisma.observation.create({ data: observation });
    },
    async findById(id) {
        return client_1.prisma.observation.findUnique({ where: { id: Number(id) } });
    },
    async findBySpeciesId(speciesId, options = {}) {
        const { status, includeDeleted = false } = options;
        return client_1.prisma.observation.findMany({
            where: {
                speciesId: Number(speciesId),
                ...(includeDeleted ? {} : { deletedAt: null }),
                ...(status && status.length > 0
                    ? {
                        status: {
                            in: status,
                        },
                    }
                    : {}),
            },
            orderBy: { createdAt: 'desc' },
        });
    },
    async findLastBySpeciesAndAuthor(speciesId, authorId) {
        return client_1.prisma.observation.findFirst({
            where: {
                speciesId: Number(speciesId),
                authorId: Number(authorId),
                deletedAt: null,
            },
            orderBy: { createdAt: 'desc' },
        });
    },
    async updateStatus(id, changes) {
        return client_1.prisma.observation.update({
            where: { id: Number(id) },
            data: changes,
        });
    },
    async softDelete(id) {
        return client_1.prisma.observation.update({
            where: { id: Number(id) },
            data: { deletedAt: new Date() },
        });
    },
    async restore(id) {
        return client_1.prisma.observation.update({
            where: { id: Number(id) },
            data: { deletedAt: null },
        });
    },
    async createHistoryEntry(entry) {
        return client_1.prisma.observationHistory.create({
            data: entry,
        });
    },
    async listHistory(options = {}) {
        const { speciesId, observationId, limit = 100 } = options;
        return client_1.prisma.observationHistory.findMany({
            where: {
                ...(speciesId ? { speciesId: Number(speciesId) } : {}),
                ...(observationId ? { observationId: Number(observationId) } : {}),
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    },
    async countActiveBySpecies(speciesId) {
        return client_1.prisma.observation.count({
            where: { speciesId: Number(speciesId), deletedAt: null },
        });
    },
};
