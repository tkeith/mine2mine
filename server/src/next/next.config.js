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
      {
        source: '/privacy',
        destination: 'https://docs.google.com/document/d/16NFZy5OKtvAJdlUKppS5SkBsjCxotKedCdHMIs36jCU/edit?usp=sharing',
        permanent: false,
      },
      {
        source: '/marketing',
        destination: 'https://m2m.tk.co/',
        permanent: false,
      },
    ]
  },
}
