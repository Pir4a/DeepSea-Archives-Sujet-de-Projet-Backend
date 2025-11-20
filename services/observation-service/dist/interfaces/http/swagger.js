"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Observation Service API',
        version: '1.0.0',
        description: 'API documentation for DeepSea Archives observation-service. Manages species, observations, and validation workflows.',
        contact: {
            name: 'DeepSea Archives',
        },
    },
    servers: [
        {
            url: `http://localhost:${process.env.OBSERVATION_SERVICE_PORT || 4002}`,
            description: 'Local development server',
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'JWT token obtained from auth-service',
            },
        },
        schemas: {
            Species: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer',
                        example: 1,
                    },
                    authorId: {
                        type: 'integer',
                        example: 1,
                    },
                    name: {
                        type: 'string',
                        example: 'Carcharodon carcharias',
                    },
                    rarityScore: {
                        type: 'number',
                        format: 'float',
                        example: 85.5,
                    },
                    createdAt: {
                        type: 'string',
                        format: 'date-time',
                        example: '2024-01-15T10:30:00Z',
                    },
                },
            },
            CreateSpeciesRequest: {
                type: 'object',
                required: ['name'],
                properties: {
                    name: {
                        type: 'string',
                        example: 'Carcharodon carcharias',
                        description: 'Unique species name',
                    },
                },
            },
            Observation: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer',
                        example: 1,
                    },
                    speciesId: {
                        type: 'integer',
                        example: 1,
                    },
                    authorId: {
                        type: 'integer',
                        example: 1,
                    },
                    description: {
                        type: 'string',
                        example: 'Large shark observed near the surface',
                    },
                    dangerLevel: {
                        type: 'integer',
                        minimum: 1,
                        maximum: 5,
                        example: 4,
                    },
                    status: {
                        type: 'string',
                        enum: ['PENDING', 'VALIDATED', 'REJECTED'],
                        example: 'PENDING',
                    },
                    validatedBy: {
                        type: 'integer',
                        nullable: true,
                        example: 2,
                    },
                    validatedAt: {
                        type: 'string',
                        format: 'date-time',
                        nullable: true,
                        example: '2024-01-15T11:00:00Z',
                    },
                    createdAt: {
                        type: 'string',
                        format: 'date-time',
                        example: '2024-01-15T10:30:00Z',
                    },
                    deletedAt: {
                        type: 'string',
                        format: 'date-time',
                        nullable: true,
                        example: null,
                    },
                },
            },
            CreateObservationRequest: {
                type: 'object',
                required: ['speciesId', 'description'],
                properties: {
                    speciesId: {
                        type: 'integer',
                        example: 1,
                    },
                    description: {
                        type: 'string',
                        example: 'Large shark observed near the surface',
                    },
                    dangerLevel: {
                        type: 'integer',
                        minimum: 1,
                        maximum: 5,
                        default: 1,
                        example: 4,
                    },
                },
            },
            RejectObservationRequest: {
                type: 'object',
                properties: {
                    reason: {
                        type: 'string',
                        example: 'Insufficient evidence',
                    },
                },
            },
            ObservationHistory: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer',
                        example: 1,
                    },
                    observationId: {
                        type: 'integer',
                        example: 1,
                    },
                    speciesId: {
                        type: 'integer',
                        example: 1,
                    },
                    authorId: {
                        type: 'integer',
                        example: 1,
                    },
                    action: {
                        type: 'string',
                        enum: ['CREATED', 'VALIDATED', 'REJECTED', 'DELETED', 'RESTORED'],
                        example: 'VALIDATED',
                    },
                    payload: {
                        type: 'object',
                        nullable: true,
                    },
                    performedBy: {
                        type: 'integer',
                        nullable: true,
                        example: 2,
                    },
                    createdAt: {
                        type: 'string',
                        format: 'date-time',
                        example: '2024-01-15T11:00:00Z',
                    },
                },
            },
            ApiResponse: {
                type: 'object',
                properties: {
                    status: {
                        type: 'string',
                        example: 'success',
                    },
                    data: {
                        type: 'object',
                    },
                },
            },
            ApiError: {
                type: 'object',
                properties: {
                    status: {
                        type: 'string',
                        example: 'error',
                    },
                    message: {
                        type: 'string',
                        example: 'Error message',
                    },
                    details: {
                        type: 'object',
                        nullable: true,
                    },
                },
            },
        },
    },
    security: [
        {
            bearerAuth: [],
        },
    ],
};
const options = {
    definition: swaggerDefinition,
    apis: ['./src/interfaces/http/routes/*.ts'],
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
