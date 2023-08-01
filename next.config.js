const { i18n } = require("./next-i18next.config");

module.exports = {
    experimental: {
        newNextLinkBehavior: true,
    },
    reactStrictMode: true,
    images: {
        domains: [
            "i.ibb.co",
            "images.pexels.com",
            "lh3.googleusercontent.com",
            "i.pravatar.cc",
            "firebasestorage.googleapis.com",
        ],
        formats: ['image/webp'],
    },
};
