module.exports = {
  target: 'serverless',
  // Use the CDN in production and localhost for development.
  assetPrefix: process.env.ASSET_PREFIX,
}
