/** @type {import('next').NextConfig} */
const nextConfig = {
  // SOLID: Permette a Next.js di compilare i pacchetti condivisi del monorepo
  transpilePackages: ["@strade-servizi/db"],

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
         * Usiamo 127.0.0.1 per evitare i ritardi di risoluzione DNS di Windows.
         */
        source: '/api/:path*',
        destination: 'http://127.0.0.1:3001/:path*',
      },
    ];
  },
};

export default nextConfig;
