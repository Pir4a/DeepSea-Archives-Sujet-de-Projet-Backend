"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Entrée principale du microservice observation-service (TypeScript)
const common_1 = require("@deepsea/common");
const app_1 = require("./interfaces/http/app");
const PORT = process.env.OBSERVATION_SERVICE_PORT || 4002;
const app = (0, app_1.createApp)();
app.listen(PORT, () => {
    common_1.logger.info('observation-service_started', { port: PORT });
});
