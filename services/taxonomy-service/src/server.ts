import { createApp } from './interfaces/http/app';

const PORT = process.env.TAXONOMY_SERVICE_PORT || 4003;

async function startServer() {
  const app = createApp();

  app.listen(PORT, () => {
    console.log(`Taxonomy Service running on port ${PORT}`);
    console.log(`Documentation available at http://localhost:${PORT}/api-docs`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

