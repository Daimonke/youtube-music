/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // images
  images: {
    domains: ['i.ytimg.com'],
    loader: 'default',
    optimizeImages: true,
  }
}

module.exports = nextConfig
