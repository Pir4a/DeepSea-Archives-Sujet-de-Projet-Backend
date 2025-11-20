import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DeepSea Taxonomy Service API',
      version: '1.0.0',
      description: 'API for taxonomy stats and classification',
    },
    servers: [
      {
        url: 'http://localhost:4003',
        description: 'Local server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        TaxonomyStats: {
          type: 'object',
          properties: {
            totalSpecies: { type: 'integer' },
            totalObservations: { type: 'integer' },
            speciesStats: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  speciesId: { type: 'integer' },
                  speciesName: { type: 'string' },
                  totalObservations: { type: 'integer' },
                  averageDangerLevel: { type: 'number' },
                  classification: { type: 'string' },
                  topKeywords: { type: 'array', items: { type: 'string' } }
                }
              }
            }
          }
        }
      }
    },
  },
  apis: ['./src/interfaces/http/routes/*.ts'],
};

export const specs = swaggerJsdoc(options);

