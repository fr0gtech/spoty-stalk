module.exports = {
  images:{
    domains: ['i.scdn.co', 'mosaic.scdn.co', 'scdn.co', 'newjams-images.scdn.co']
  },
  reactStrictMode: true,
  experimental: {
    transpilePackages: ["ui"],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });

    return config;
  }
};
