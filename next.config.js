/** @type {import('next').NextConfig} */

const withTM = require("next-transpile-modules")([
  "@codegouvfr/react-dsfr",
  "@uiw/react-md-editor",
  "@uiw/react-markdown-preview",
]);

module.exports = withTM({
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["static.data.gouv.fr"],
  },
  compiler: {
    styledComponents: true,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.woff2$/,
      type: "asset/resource",
    });

    return config;
  },
});
