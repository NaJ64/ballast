const path = require('path');
const config = {
    entry: './dist/index.js',
    output: {
        filename: 'index.js',
        path: path.resolve('./wwwroot/')
    },
    mode: 'development',
    watch: true,
    watchOptions: {
        aggregateTimeout: 300,
        ignored: [
            path.resolve('./node_modules') + /\/(?!(ballast-core|ballast-client)).*/,
            path.resolve('./node_modules/ballast-core/node_modules/')+ /\/(?!dist).*/,
            path.resolve('./node_modules/ballast-client/node_modules/')+ /\/(?!dist).*/,
        ]
    }
};

module.exports = config;