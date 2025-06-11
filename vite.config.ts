// vite.config.ts
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  return {
    plugins: [react()],
    server: {
      port: 5173,
      host: true,
      proxy: {
        '/api': {
          target: 'https://marvelrivalsapi.com',
          changeOrigin: true,
          secure: true,
          ws: true,
          rewrite: (path) => path.replace(/^\/api/, '/api/v1'),
          // logLevel: 'debug', // Removed debug log level

          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq, req, res) => {
              const apiKey = env.VITE_MARVEL_RIVALS_API_KEY;

              // Ensure the x-api-key header is set
              proxyReq.setHeader('x-api-key', apiKey);

              // Force Accept-Encoding to 'identity' for compatibility
              proxyReq.setHeader('Accept-Encoding', 'identity');

              // console.log('[Vite Proxy] Outgoing headers:', proxyReq.getHeaders()); // Removed log
            });

            // Removed proxyRes and error logging
            // proxy.on('proxyRes', (proxyRes, req, res) => {
            //   console.log('[Vite Proxy] Response status:', proxyRes.statusCode, proxyRes.statusMessage);
            //   console.log('[Vite Proxy] Response headers:', proxyRes.headers);
            // });
            // proxy.on('error', (err, req, res) => {
            //   console.error('[Vite Proxy] Proxy error:', err);
            // });
          },
        },
      },
    },
  };
});