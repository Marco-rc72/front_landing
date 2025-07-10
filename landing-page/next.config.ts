import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Habilitar páginas en la raíz del proyecto
  pageExtensions: ['page.tsx', 'page.ts', 'tsx', 'ts'], 
  
  // 2. Configuración para manejar archivos en raíz como rutas
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/pages': process.cwd(), // Apunta a la raíz del proyecto
    };
    return config;
  },

  // 3. Reescribe rutas para archivos en raíz
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/page', // Mapea / a tu page.tsx
      },
      {
        source: '/contacto',
        destination: '/formularioContacto',
      },
      {
        source: '/terminos',
        destination: '/Terminos',
      }
    ]
  },

  // 4. Configuración experimental para soporte avanzado
  experimental: {
    externalDir: true, // Permite archivos fuera del directorio estándar
    serverComponentsExternalPackages: ['fs'], // Necesario para ciertas operaciones
  },

  // 5. Configuración para TypeScript
  typescript: {
    ignoreBuildErrors: true, // Temporal durante la transición
  }
};

export default nextConfig;