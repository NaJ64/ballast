var watch = !(process.argv.indexOf("--no-watch") >= 0)
const path = require('path');
const config = {
    entry: './lib/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js',
        library: 'BallastClient',
        libraryTarget: 'commonjs2'
    },
    mode: 'development',
    watch: watch,
    watchOptions: {
        aggregateTimeout: 300,
        ignored: [
            /node_modules([\\]+|\/)+(?!\ballast-core([\\]+|\/)dist)/, 
            /\ballast-core([\\]+|\/)node_modules/
            // path.resolve(__dirname, 'node_modules') + /\/(?!(ballast-core)).*/,
            // path.resolve(__dirname, 'node_modules/ballast-core') + /\/(?!(dist)).*/
        ]
    }
};
module.exports = config;