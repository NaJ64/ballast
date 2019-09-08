const path = require("path");

const config = {
    mode: "development",
    entry: "./src/index.ts",
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    module: {
      rules: [{ test: /\.tsx?$/, loader: "ts-loader" }]
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "index.js"
    }
};
module.exports = config;