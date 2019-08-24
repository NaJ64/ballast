const del = require("del");
const { watch, series, dest } = require("gulp");
const merge = require("merge2");
const ts = require("gulp-typescript");
const tsProject = ts.createProject("tsconfig.json", { "declaration": true });

function clean() {
    return del(["./lib/**"]);
}

function compileTs() {
    const destDir = "lib";
    const tsResult = tsProject.src().pipe(tsProject());
    return merge([
        tsResult.js.pipe(dest(destDir)),
        tsResult.dts.pipe(dest(destDir))
    ]);
}

function watchTs() {
    watch("src/*.ts", compileTs);
}

exports.build = series(clean, compileTs);
exports.clean = clean;
exports.watch = series(clean, compileTs, watchTs);
exports.default = series(clean, compileTs);