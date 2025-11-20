"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const common_1 = require("@deepsea/common");
const speciesRoutes_1 = __importDefault(require("./routes/speciesRoutes"));
const observationRoutes_1 = __importDefault(require("./routes/observationRoutes"));
const swagger_1 = require("./swagger");
const PrismaSpeciesRepository_1 = require("../../infrastructure/repositories/PrismaSpeciesRepository");
const PrismaObservationRepository_1 = require("../../infrastructure/repositories/PrismaObservationRepository");
const AuthServiceClient_1 = require("../../infrastructure/services/AuthServiceClient");
/**
 * Couche interfaces (HTTP) – composition de l'app Express.
 * On injectera plus tard les use cases/domain dans les contrôleurs via deps.
 */
function createApp(deps = {}) {
    const defaultDeps = {
        speciesRepository: PrismaSpeciesRepository_1.PrismaSpeciesRepository,
        observationRepository: PrismaObservationRepository_1.PrismaObservationRepository,
        authService: new AuthServiceClient_1.AuthServiceClient(),
    };
    const resolvedDeps = {
        ...defaultDeps,
        ...deps,
    };
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    // Swagger UI - accessible without authentication for documentation
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec, {
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'Observation Service API Documentation',
    }));
    // Swagger JSON endpoint
    app.get('/api-docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swagger_1.swaggerSpec);
    });
    // Toutes les opérations utilisateur doivent être protégées par JWT.
    // Development mode: allow bypassing auth when DISABLE_AUTH=true
    const disableAuth = process.env.DISABLE_AUTH === 'true';
    if (disableAuth) {
        common_1.logger.warn('auth_disabled', {
            message: '⚠️  AUTHENTICATION DISABLED - Development mode only!',
        });
        app.use((req, res, next) => {
            // Mock user for development
            req.user = { id: 1, role: 'USER', reputation: 0 };
            next();
        });
    }
    else {
        app.use(common_1.auth.authMiddleware);
    }
    // Routes principales
    (0, speciesRoutes_1.default)(app, resolvedDeps);
    (0, observationRoutes_1.default)(app, resolvedDeps);
    // 404 + gestion d'erreurs communes
    app.use(common_1.notFoundHandler);
    app.use(common_1.errorHandler);
    return app;
}
