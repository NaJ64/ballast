const path = require("path");
const ThreeWebpackPlugin = require("@wildpeaks/three-webpack-plugin");

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
    filename: "index.js",
    library: "BallastUI",
    libraryTarget: "commonjs2"
  },
  plugins: [
    new ThreeWebpackPlugin()
  ]
};
module.exports = config;