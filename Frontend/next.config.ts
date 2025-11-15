/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbopackUseSystemTlsCerts: true,  // Arregla error TLS
  },
  fonts: {
    optimizeFonts: false,     // Desactiva sistema interno de fuentes
  }
};

module.exports = nextConfig;