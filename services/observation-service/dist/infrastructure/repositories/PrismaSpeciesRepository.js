"use strict";
// Implémentation Prisma du port SpeciesRepository.
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaSpeciesRepository = void 0;
const client_1 = require("../prisma/client");
exports.PrismaSpeciesRepository = {
    async create(species) {
        return client_1.prisma.species.create({ data: species });
    },
    async findById(id) {
        return client_1.prisma.species.findUnique({ where: { id: Number(id) } });
    },
    async findAll(options = {}) {
        const { sortBy = 'createdAt', order = 'desc', minRarity } = options;
        return client_1.prisma.species.findMany({
            where: typeof minRarity === 'number'
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
    async findByName(name) {
        return client_1.prisma.species.findUnique({ where: { name } });
    },
    async updateRarityScore(id, rarityScore) {
        return client_1.prisma.species.update({
            where: { id: Number(id) },
            data: { rarityScore },
        });
    },
};
