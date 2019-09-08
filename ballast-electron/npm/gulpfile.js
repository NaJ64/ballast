const del = require("del");
const { dest, parallel, series, src, watch } = require("gulp");
const filter = require("gulp-filter");
const ts = require("gulp-typescript");
const merge = require("merge2");
const doWebpack = require("webpack");
const webpackConfig = require("./webpack.config.js");

const tsProject = ts.createProject("tsconfig.json", { "declaration": false });

function clean() {
    return del(["./dist/**", "./dist"]);
}

function tsc() {
    return tsProject.src()
        .pipe(tsProject())
        .js
        .pipe(filter(file => 
            (file.relative == "main.js") ||
            (file.relative == "app-host.js")
        ))        
        .pipe(dest("dist"));
}

function watchTs() {
    watch("src/**/!(index).ts", tsc);
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

exports.build = series(clean, parallel(webpack, tsc, copyStatic));
exports.clean = clean;
exports.watch = series(
    clean, 
    parallel(tsc, copyStatic), // initial webpack occurs in subsequent "watchWebpack" step
    parallel(watchWebpack, watchTs, watchStatic)
);
exports.watchTs = watchTs;
exports.default = series(clean, parallel(webpack, tsc, copyStatic));