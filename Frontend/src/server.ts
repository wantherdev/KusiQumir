import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import { createProxyMiddleware } from 'http-proxy-middleware';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

const API_TARGET = process.env['API_URL'] ?? 'http://localhost:3000';

app.use(
  '/api',
  createProxyMiddleware({
    target: API_TARGET,
    changeOrigin: true,
    pathRewrite: {
      '^/api': '/api/v1',
    },
  }),
);

app.use(
  '/uploads',
  createProxyMiddleware({
    target: API_TARGET,
    changeOrigin: true,
  }),
);

app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

app.use((_req, res) => {
  res.status(404).json({
    statusCode: 404,
    message: 'Recurso no encontrado',
    timestamp: new Date().toISOString(),
  });
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (process.env['NODE_ENV'] !== 'production') console.error('[SSR Error]', err.message);
  res.status(500).json({
    statusCode: 500,
    message: 'Error interno del servidor',
    timestamp: new Date().toISOString(),
  });
});

if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }
    if (process.env['NODE_ENV'] !== 'production') console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

export const reqHandler = createNodeRequestHandler(app);
