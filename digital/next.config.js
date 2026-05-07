/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow Google profile images
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },
}

module.exports = nextConfig
