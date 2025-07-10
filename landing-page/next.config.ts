import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  pageExtensions: ['tsx', 'ts', 'page.tsx'],
  
  rewrites: async () => [
    { source: '/', destination: '/page' },
    { source: '/contacto', destination: '/formularioContacto' },
    { source: '/terminos', destination: '/Terminos' }
  ],

  // Configuración mínima experimental
  experimental: {
    externalDir: true
  }
};

export default nextConfig;