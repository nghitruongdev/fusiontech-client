/** @format */

const { i18n } = require('./next-i18next.config')

module.exports = {
  experimental: {
    newNextLinkBehavior: true,
  },
  reactStrictMode: true,
  images: {
    domains: [
      'i.ibb.co',
      'images.unsplash.com',
      'images.macrumors.com',
      'images.pexels.com',
      'lh3.googleusercontent.com',
      'i.pravatar.cc',
      'firebasestorage.googleapis.com',
      'storage.googleapis.com',
      'cdn.mos.cms.futurecdn.net',
      'iphoneros.com',
      'img.freepik.com',
      'static.wixstatic.com',
      'www.pngmart.com',
      'www.freepnglogos.com',
      'pngimg.com',
      'www.trustedreviews.com',
      'cdn-icons-png.flaticon.com',
      'i.pinimg.com',
      'cdn.freebiesupply.com',
      'example.com',
      'cdn2.cellphones.com.vn',
    ],
    formats: ['image/webp'],
  },
}
