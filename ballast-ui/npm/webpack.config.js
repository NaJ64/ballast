var watch = (process.argv.indexOf("--watch") >= 0)
const path = require("path");
const config = {
    entry: "./lib/index.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "index.js",
        library: "BallastUi",
        libraryTarget: "commonjs2"
    },
    mode: "development",
    watch: watch,
    watchOptions: {
        aggregateTimeout: 300,
        ignored: [
            /\ballast-client([\\]+|\/)node_modules/,
            /node_modules([\\]+|\/)+(?!\ballast-client([\\]+|\/)dist)/, 
        ]
    }
};
module.exports = config;