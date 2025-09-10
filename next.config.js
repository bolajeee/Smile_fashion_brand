const path = require('path')

module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'src/assets/css')],
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
}