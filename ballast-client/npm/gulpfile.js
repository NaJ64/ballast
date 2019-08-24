const del = require("del");
const { dest, series, watch } = require("gulp");
const ts = require("gulp-typescript");
const merge = require("merge2");

const tsProject = ts.createProject("tsconfig.json", { "declaration": true });

function clean() {
    return del(["./lib/**", "./lib"]);
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

exports.build = series(clean, tsc);
exports.clean = clean;
exports.watch = series(clean, tsc, watchTs);
exports.default = series(clean, tsc);