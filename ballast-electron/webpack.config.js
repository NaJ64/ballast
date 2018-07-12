var watch = !(process.argv.indexOf("--no-watch") >= 0)
const path = require('path');
const config = {
    entry: './lib/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js'
    },
    mode: 'development',
    watch: watch,
    watchOptions: {
        aggregateTimeout: 300,
        ignored: [
            path.resolve(__dirname, 'node_modules') + '/(?!ballast-client)',
            path.resolve(__dirname, 'node_modules/ballast-client/node_modules')
        ]
    }
};
module.exports = config;