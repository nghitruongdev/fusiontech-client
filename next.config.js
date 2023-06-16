const { i18n } = require("./next-i18next.config");

module.exports = {
    i18n,
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
        ],
    },
};
