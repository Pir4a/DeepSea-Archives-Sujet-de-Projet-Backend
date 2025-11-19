// Entrée principale du microservice observation-service (TypeScript)
const { logger } = require('@deepsea/common');
const { createApp } = require('./interfaces/http/app');

const PORT = process.env.OBSERVATION_SERVICE_PORT || 4002;

const app = createApp();

app.listen(PORT, () => {
  logger.info('observation-service_started', { port: PORT });
});


