import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, 'dist');
const port = Number(process.env.PORT) || 4173;

const apiTarget =
  process.env.GREEN_API_TARGET_URL?.replace(/\/$/, '') ||
  'https://3100.api.green-api.com';

const app = express();

app.use(
  '/green-api',
  createProxyMiddleware({
    target: apiTarget,
    changeOrigin: true,
    pathRewrite: { '^/green-api': '' },
    secure: true,
  }),
);

app.use(express.static(distDir, { index: false }));

app.get('*', (_req, res) => {
  res.sendFile(path.join(distDir, 'index.html'));
});

app.listen(port, () => {
  console.log(`MAX Web Chat: http://0.0.0.0:${port}`);
  console.log(`GREEN-API proxy → ${apiTarget}`);
});
