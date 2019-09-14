const del = require("del");
const { dest, parallel, series, src, watch } = require("gulp");
const doWebpack = require("webpack");
const webpackConfig = require("./webpack.config.js");
const merge = require("merge2");

function clean() {
    return del(["./dist/**", "./dist"]);
}

function webpack() {
    return new Promise((resolve, reject) => {
        doWebpack(webpackConfig, (err, stats) => {
            if (err) {
                return reject(err);
            }
            if (stats.hasErrors()) {
                return reject(new Error(stats.compilation.errors.join('\n')));
            }
            resolve();
        });
    });
}

function watchWebpack() {
    return new Promise((resolve, reject) => {
        doWebpack(webpackConfig).watch({
            aggregateTimeout: 1500,
            poll: undefined,
            ignored: [
                /\ballast-ui([\\]+|\/)node_modules/,
                /node_modules([\\]+|\/)+(?!\ballast-ui([\\]+|\/)dist)/,
            ]
        }, (err, stats) => {
            if (err) {
                return reject(err);
            }
            if (stats.hasErrors()) {
                return reject(new Error(stats.compilation.errors.join('\n')));
            }
            console.log(stats.toString())
            //resolve(); // Do not resolve promise (so that we don't stop watching)
        });
    });
}

function copyStatic() {
    return merge([
        src("./node_modules/ballast-ui/dist/assets/**/*")
            .pipe(dest("./dist/assets")),
        src("./src/**/*.!(ts)")
            .pipe(dest("dist"))
    ]);
}

function watchStatic() {
    watch([
        "./node_modules/ballast-ui/dist/assets/**/*",
        "./src/**/*.!(ts)"
    ], copyStatic);
}

exports.build = series(clean, parallel(webpack, copyStatic));
exports.clean = clean;
exports.watch = series(
    clean, 
    copyStatic, // initial webpack occurs in subsequent "watchWebpack" step
    parallel(watchWebpack, watchStatic)
);
exports.default = series(clean, parallel(webpack, copyStatic));