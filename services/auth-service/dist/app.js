"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
// Import des routes
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const internalRoutes_1 = __importDefault(require("./routes/internalRoutes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const swaggerPath = path_1.default.join(__dirname, "swagger", "auth.yaml");
const swaggerDoc = yamljs_1.default.load(swaggerPath);
// Route /docs
app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDoc));
// Route /auth
app.use("/auth", authRoutes_1.default);
// Route /admin
app.use("/admin", adminRoutes_1.default);
// Route /internal
app.use("/internal", internalRoutes_1.default);
exports.default = app;
