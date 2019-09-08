const del = require("del");
const { dest, parallel, series, src, watch } = require("gulp");
const concat = require("gulp-concat");
const filter = require("gulp-filter");
const replace = require("gulp-replace");
const ts = require("gulp-typescript");
const doWebpack = require("webpack");
const webpackConfig = require("./webpack.config.js");

const tsProject = ts.createProject("tsconfig.json", { "declaration": true });

function clean() {
    return del(["./dist/**", "./dist"]);
}

function dts() {
    return tsProject.src()
        .pipe(tsProject())
        .dts
        .pipe(filter(file => 
            (file.relative == "index.d.ts") ||
            (file.relative == "bootstrapper.d.ts") ||
            (file.relative == "html-client.d.ts")
        ))        
        .pipe(replace(/import[^;]+;/g, ''))
        .pipe(replace(/export {[^;]+;/g, ''))
        .pipe(concat("index.d.ts"))
        .pipe(dest("dist"));
}

function watchTs() {
    watch("src/**/*.ts", compileDts);
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

exports.build = series(clean, parallel(webpack, copyAssets, dts));
exports.clean = clean;
exports.watch = series(
    clean, 
    parallel(dts, copyAssets), // initial webpack occurs in subsequent "watchWebpack" step
    parallel(watchWebpack, watchAssets, watchTs)
);
exports.default = series(clean, parallel(webpack, copyAssets, dts));