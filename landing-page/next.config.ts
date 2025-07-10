import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuración básica
  pageExtensions: ['page.tsx', 'page.ts', 'tsx', 'ts'],
  output: 'standalone',
  
  // Reescribe rutas para tu estructura
  async rewrites() {
    return [
      { source: '/', destination: '/page' },
      { source: '/contacto', destination: '/formularioContacto' },
      { source: '/terminos', destination: '/Terminos' }
    ];
  },

  // Configuración de Webpack para alias
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@root': process.cwd()
    };
    return config;
  },

  // Elimina la sección 'experimental' o usa solo propiedades compatibles
  experimental: {
    // Solo propiedades válidas en Next.js 15.x
    externalDir: true,
    optimizePackageImports: ['react-google-recaptcha']
  }
};

export default nextConfig;