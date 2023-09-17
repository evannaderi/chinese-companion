const path = require('path');

module.exports = {
  webpack: (config) => {
    config.resolve.alias['jieba-js'] = path.resolve(__dirname, 'node_modules/jieba-js/lib/jieba.js');

    return config;
  },
};