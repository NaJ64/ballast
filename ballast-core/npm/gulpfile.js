const del = require("del");
const gulp = require("gulp");
const merge = require("merge2");
const ts = require("gulp-typescript");
const tsProject = ts.createProject("tsconfig.json", { "declaration": true });

gulp.task("clean", () => {
    return del(["./lib/**"]);
})

gulp.task("compile:ts", () => {
    const tsResult = tsProject.src().pipe(tsProject());
    return merge([
        tsResult.js.pipe(gulp.dest("lib")),
        tsResult.dts.pipe(gulp.dest("lib"))
    ]);
});

gulp.task("bundle:ts", () => {
    return Promise.resolve(); // Perform bundling here
});

gulp.task("compile", gulp.parallel("compile:ts"));

gulp.task("bundle", gulp.parallel("bundle:ts"));

gulp.task("build", gulp.series("clean", "compile", "bundle"));

gulp.task("watch:ts", () => {
    gulp.watch("src/*.ts", gulp.series("compile:ts", "bundle:ts"))
});

gulp.task("watch", gulp.series("build", gulp.parallel("watch:ts")));

gulp.task("default", gulp.series("build"));