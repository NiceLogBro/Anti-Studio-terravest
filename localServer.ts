import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { app as api, configureGemini } from './server';

dotenv.config();
configureGemini(process.env.GEMINI_API_KEY);

const webApp = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = Number(process.env.PORT || 3000);

webApp.use('/api', express.json({ limit: '10mb' }), (req, res, next) => {
  const requestPath = new URL(req.originalUrl, 'http://localhost').pathname;
  api.dispatch(req.method, requestPath, req.body)
    .then(({ status, body }) => res.status(status).json(body))
    .catch(next);
});

async function startServer(): Promise<void> {
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, 'dist');
    webApp.use(express.static(distPath));
    webApp.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    webApp.use(vite.middlewares);
  }

  webApp.listen(port, '0.0.0.0', () => {
    console.log(`TerraYield AI server running at http://0.0.0.0:${port}`);
  });
}

startServer().catch((error: unknown) => {
  console.error('Fatal server start error:', error);
  process.exit(1);
});
