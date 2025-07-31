import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  pageExtensions: ['tsx', 'ts', 'page.tsx'],

  rewrites: async () => [
    { source: '/contacto', destination: '/formularioContacto' },
    { source: '/terminos', destination: '/Terminos' }
  ],

  eslint: {
    ignoreDuringBuilds: true, // 👈 esto evita que errores de lint bloqueen el deploy
  },

  experimental: {
    externalDir: true
  }
};

export default nextConfig;
