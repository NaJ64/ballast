const del = require("del");
const { dest, parallel, series, src, watch } = require("gulp");
const ts = require("gulp-typescript");
const merge = require("merge2");
const doWebpack = require("webpack");
const webpackConfig = require("./webpack.config.js");

const tsProject = ts.createProject("tsconfig.json", { "declaration": true });

function clean() {
    return del(["./lib/**", "./lib", "./dist/**", "./dist"]);
}

function tsc() {
    const tsResult = tsProject.src().pipe(tsProject());
    return merge([
        tsResult.js.pipe(dest("lib")),
        tsResult.dts.pipe(dest("lib"))
    ]);
}

function watchTs() {
    watch("src/**/*.ts", tsc);
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
            aggregateTimeout: 300,
            poll: undefined,
            ignored: [
                /\ballast-client([\\]+|\/)node_modules/,
                /\ballast-core([\\]+|\/)node_modules/,
                /node_modules([\\]+|\/)+(?!\ballast-client([\\]+|\/)lib)/,
                /node_modules([\\]+|\/)+(?!\ballast-core([\\]+|\/)lib)/ 
            ]
        }, (err, stats) => {
            if (err) {
                return reject(err);
            }
            if (stats.hasErrors()) {
                return reject(new Error(stats.compilation.errors.join('\n')));
            }
            //resolve(); // Do not resolve promise (so that we don't stop watching)
        });
    });
}

function copyAssets() {
    return src("./src/assets/**/*{jpg,png,gltf,bin}")
        .pipe(dest("./dist/assets"));
}

function watchAssets() {
    watch("src/assets/**/*.{jpg,png,gltf,bin}", copyAssets);
}

exports.build = series(clean, parallel(webpack, copyAssets, tsc));
exports.clean = clean;
exports.watchWebpack = watchWebpack;
exports.watch = series(
    clean, 
    parallel(tsc, copyAssets), // initial webpack occurs in subsequent "watchWebpack" step
    parallel(watchWebpack, watchAssets, watchTs)
);
exports.default = series(clean, parallel(webpack, copyAssets, tsc));