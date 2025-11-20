"use strict";
// Client Prisma pour observation-service.
// La configuration du datasource est définie dans prisma/schema.prisma.
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
exports.prisma = new client_1.PrismaClient();
