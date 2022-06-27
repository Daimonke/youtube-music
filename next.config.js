/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')

const nextConfig = withPWA({
  pwa: {
    dest: 'public',
    runtimeCaching,
  },
  images: {
    domains: ['i.ytimg.com', 'icon-library.com'],
    loader: 'default',
    optimizeImages: true,
  }
})

module.exports = nextConfig
