/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Configuración para Hostinger
  output: 'standalone',
  
  // Optimizaciones
  poweredByHeader: false,
  compress: true,
  
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
