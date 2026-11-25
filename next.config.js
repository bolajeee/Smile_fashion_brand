const path = require('path')

module.exports = {
  // Lint separately (npm run lint); ~300 pre-existing style errors would otherwise fail every build on Next 15
  eslint: {
    ignoreDuringBuilds: true,
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'src/assets/css')],
  },
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'res.cloudinary.com' }],
  },
}