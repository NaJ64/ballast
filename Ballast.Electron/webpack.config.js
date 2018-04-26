var watch = !(process.argv.indexOf("--no-watch") >= 0)
const path = require('path');
const config = {
    entry: './dist/app.js',
    output: {
        filename: 'index.js',
        path: path.resolve('./dist/')
    },
    mode: 'development',
    watch: watch,
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