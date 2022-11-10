/** @type {import('next').NextConfig} */

const withTM = require('next-transpile-modules')(['@codegouvfr/react-dsfr'])

module.exports = withTM({
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['static.data.gouv.fr']
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.(woff2|webmanifest)$/,
      type: 'asset/resource'
    })

    return config
  }
})
