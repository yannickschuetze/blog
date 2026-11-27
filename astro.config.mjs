import { defineConfig, envField } from 'astro/config';
import node from '@astrojs/node';
import { loadEnv } from 'vite';

// The public address of the blog, e.g. https://blog.example.de (set SITE_URL in .env or in Plesk before building).
const { SITE_URL = 'https://example.com' } = { ...loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), ''), ...process.env };
const site = new URL(SITE_URL);

export default defineConfig({
  site: site.origin,
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  trailingSlash: 'ignore',
  devToolbar: { enabled: false },
  security: {
    checkOrigin: true,
    // Requests for these hosts are trusted, including the proxy's X-Forwarded-Proto/-Host on netcup.
    allowedDomains: [
      { hostname: site.hostname, protocol: site.protocol.replace(':', '') },
      { hostname: 'localhost' },
    ],
  },
  env: {
    schema: {
      DB_HOST: envField.string({ context: 'server', access: 'secret', default: '127.0.0.1' }),
      DB_PORT: envField.number({ context: 'server', access: 'secret', default: 3306 }),
      DB_NAME: envField.string({ context: 'server', access: 'secret' }),
      DB_USER: envField.string({ context: 'server', access: 'secret' }),
      DB_PASSWORD: envField.string({ context: 'server', access: 'secret' }),
      ADMIN_USER: envField.string({ context: 'server', access: 'secret' }),
      ADMIN_PASSWORD_HASH: envField.string({ context: 'server', access: 'secret' }),
      UPLOAD_DIR: envField.string({ context: 'server', access: 'secret', default: './uploads' }),
    },
  },
});
