/** @type {import('next').NextConfig} */
// Force rebuild - config updated
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'w3wcdvxvirdfmxgi.public.blob.vercel-storage.com',
      },
    ],
  },
}

export default nextConfig
