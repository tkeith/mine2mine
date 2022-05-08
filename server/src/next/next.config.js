module.exports = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/app',
        destination: 'https://google.com/',
        permanent: false,
      },
    ]
  },
}
