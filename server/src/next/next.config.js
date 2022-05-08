module.exports = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/app',
        destination: 'https://google.com/',
        permanent: false,
      },
      {
        source: '/presentation',
        destination: 'https://www.canva.com/design/DAFACDQMrJc/ptGIY1cMy1OyHinTAn7OJw/view?utm_content=DAFACDQMrJc&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink',
        permanent: false,
      },
    ]
  },
}
