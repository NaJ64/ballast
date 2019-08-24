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
// module.exports = Object.assign(config, {
//   watch: true,
//   watchOptions: {
//       aggregateTimeout: 300,
//       ignored: [
//           /\ballast-client([\\]+|\/)node_modules/,
//           /\ballast-core([\\]+|\/)node_modules/,
//           /node_modules([\\]+|\/)+(?!\ballast-client([\\]+|\/)lib)/,
//           /node_modules([\\]+|\/)+(?!\ballast-core([\\]+|\/)lib)/ 
//       ]
//   }
// });