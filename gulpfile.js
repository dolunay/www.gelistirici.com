"use strict";
import bst from 'browser-sync';
import gulp from 'gulp';
import autoprefixer from 'gulp-autoprefixer';
import fileinclude from 'gulp-file-include';
import comments from 'gulp-header-comment';
import gulpSass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import rimraf from 'rimraf';

//import imagemin from 'gulp-imagemin';
//import del from 'del';

//var imagemin = require('gulp-imagemin')
//var del = require('del')

import * as sss from "sass";
const sass = gulpSass(sss);
const bs = bst.create();

// const sass = require("gulp-sass")(require("sass"));
// const gulp = require("gulp");
// const sourcemaps = require("gulp-sourcemaps");
// const fileinclude = require("gulp-file-include");
// const autoprefixer = require("gulp-autoprefixer");
// const bs = require("browser-sync").create();
// const rimraf = require("rimraf");
// const comments = require("gulp-header-comment");

var path = {
  src: {
    html: "source/*.html",
    others: "source/*.+(php|ico|png)",
    htminc: "source/partials/**/*.htm",
    incdir: "source/partials/",
    plugins: "source/plugins/**/*.*",
    js: "source/js/*.js",
    scss: "source/scss/**/*.scss",
    images: "source/images/**/*.+(png|jpg|gif|svg)",
  },
  build: {
    dirBuild: "dist/",
    dirDev: "dist/",
  },
};

// HTML
gulp.task("html:build", function () {
  return gulp
    .src(path.src.html)
    .pipe(
      fileinclude({
        basepath: path.src.incdir,
      })
    )
    .pipe(
      comments(`
    WEBSITE: https://gelistirici.com
    TWITTER: https://twitter.com/gelistirici
    FACEBOOK: https://www.facebook.com/gelistirici
    GITHUB: https://github.com/gelistirici/
    `)
    )
    .pipe(gulp.dest(path.build.dirDev))
    .pipe(
      bs.reload({
        stream: true,
      })
    );
});

// SCSS
gulp.task("scss:build", function () {
  return gulp
    .src(path.src.scss)
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        outputStyle: "expanded",
      }).on("error", sass.logError)
    )
    .pipe(autoprefixer())
    .pipe(sourcemaps.write("/"))
    .pipe(
      comments(`
    WEBSITE: https://gelistirici.com
    TWITTER: https://twitter.com/gelistirici
    FACEBOOK: https://www.facebook.com/gelistirici
    GITHUB: https://github.com/gelistirici/
    `)
    )
    .pipe(gulp.dest(path.build.dirDev + "css/"))
    .pipe(
      bs.reload({
        stream: true,
      })
    );
});

// Javascript
gulp.task("js:build", function () {
  return gulp
    .src(path.src.js)
    .pipe(
      comments(`
  WEBSITE: https://gelistirici.com
  TWITTER: https://twitter.com/gelistirici
  FACEBOOK: https://www.facebook.com/gelistirici
  GITHUB: https://github.com/gelistirici/
  `)
    )
    .pipe(gulp.dest(path.build.dirDev + "js/"))
    .pipe(
      bs.reload({
        stream: true,
      })
    );
});

// Minify and copy new images to dist
gulp.task('imagemin:build', function () {
  return gulp.src('source/images/**/*', {encoding: false})
    //.pipe(imagemin())
    .pipe(gulp.dest('dist/images/'))
});

// Images
/*
gulp.task("images:build", function () {
  return gulp
    .src(path.src.images)
    .pipe(gulp.dest(path.build.dirDev + "images/"))
    .pipe(
      bs.reload({
        stream: true,
      })
    );
});
*/
// Plugins
gulp.task("plugins:build", function () {
  return gulp
    .src(path.src.plugins, {encoding: false})
    .pipe(gulp.dest(path.build.dirDev + "plugins/"))
    .pipe(
      bs.reload({
        stream: true,
      })
    );
});

// Other files like favicon, php, sourcele-icon on root directory
gulp.task("others:build", function () {
  return gulp.src(path.src.others).pipe(gulp.dest(path.build.dirDev));
});

// Clean Build Folder
gulp.task("clean", function (cb) {
  rimraf("./dist", cb);
});

// Watch Task
gulp.task("watch:build", function () {
  gulp.watch(path.src.html, gulp.series("html:build"));
  gulp.watch(path.src.htminc, gulp.series("html:build"));
  gulp.watch(path.src.scss, gulp.series("scss:build"));
  gulp.watch(path.src.js, gulp.series("js:build"));
  //gulp.watch(path.src.images, gulp.series("images:build"));
  gulp.watch(path.src.images, gulp.series("imagemin:build"));
  gulp.watch(path.src.plugins, gulp.series("plugins:build"));
});

// Dev Task
gulp.task(
  "default",
  gulp.series(
    "clean",
    "html:build",
    "js:build",
    "scss:build",
    //"images:build",
    "imagemin:build",
    "plugins:build",
    "others:build",
    gulp.parallel("watch:build", function () {
      bs.init({
        server: {
          baseDir: path.build.dirDev,
        },
      });
    })
  )
);

// Build Task
gulp.task(
  "build",
  gulp.series(
    "html:build",
    "js:build",
    "scss:build",
    //"images:build",
    "imagemin:build",
    "plugins:build"
  )
);
