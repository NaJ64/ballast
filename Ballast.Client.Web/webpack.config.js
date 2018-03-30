const path = require('path');
const config = {
    entry: './dist/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve('./wwwroot/')
    }
};

module.exports = config;