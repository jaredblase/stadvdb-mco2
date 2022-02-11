module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['tailwindui.com'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/:path*'
      }
    ]
  }
}
