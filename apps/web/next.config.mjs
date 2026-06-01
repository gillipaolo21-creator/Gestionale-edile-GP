/** @type {import('next').NextConfig} */
const apiBaseUrl = (process.env.API_BASE_URL || 'http://127.0.0.1:3001').replace(/\/$/, '');

const nextConfig = {
  // SOLID: Permette a Next.js di compilare i pacchetti condivisi del monorepo
  transpilePackages: ["@strade-servizi/db"],

  // Docker: produce output standalone per il runtime container
  output: 'standalone',

  // Disabilitiamo l'indicatore di overlay che può interferire con il design
  devIndicators: {
    appIsrStatus: false,
  },

  async rewrites() {
    return [
      {
        /**
         * PROXY DEFINITIVO:
         * Risolviamo il "Failed to fetch" (CORS).
         * API_BASE_URL permette di cambiare host in Docker/prod.
         */
        source: '/api/:path*',
        destination: `${apiBaseUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
