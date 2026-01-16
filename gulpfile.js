"use strict";
import bst from 'browser-sync';
import gulp from 'gulp';
import autoprefixer from 'gulp-autoprefixer';
import fileinclude from 'gulp-file-include';
import comments from 'gulp-header-comment';
import htmlmin from 'gulp-htmlmin';
import gulpSass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import fs from 'node:fs/promises';
import nodePath from 'node:path';
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
    html: ["source/index.html", "source/tr/*.html", "source/en/*.html"],
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

const SITE_URL = "https://www.gelistirici.com";

async function walkHtmlFiles(dirAbs, baseAbs) {
  const entries = await fs.readdir(dirAbs, { withFileTypes: true });
  const results = [];
  for (const entry of entries) {
    const abs = nodePath.join(dirAbs, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await walkHtmlFiles(abs, baseAbs)));
      continue;
    }
    if (entry.isFile() && entry.name.toLowerCase().endsWith('.html')) {
      results.push(abs.substring(baseAbs.length + 1));
    }
  }
  return results;
}

function sitemapLocFromRelPath(relPath) {
  const normalized = relPath.replace(/\\/g, '/');
  if (normalized === 'index.html') {
    return SITE_URL + '/';
  }
  if (normalized.endsWith('/index.html')) {
    return SITE_URL + '/' + normalized.slice(0, -'index.html'.length);
  }
  return SITE_URL + '/' + normalized;
}

async function isNoIndexHtml(distAbs, relPath) {
  try {
    const html = await fs.readFile(nodePath.join(distAbs, relPath), 'utf8');
    return /<meta\s+name=["']robots["']\s+content=["'][^"']*noindex/i.test(html);
  } catch {
    return false;
  }
}

gulp.task('seo:build', function () {
  const distAbs = nodePath.resolve('dist');
  return (async () => {
    const files = await walkHtmlFiles(distAbs, distAbs);
    files.sort();
    const lastmod = new Date().toISOString().slice(0, 10);
    const includedFiles = [];
    for (const file of files) {
      if (await isNoIndexHtml(distAbs, file)) {
        continue;
      }
      includedFiles.push(file);
    }

    const urls = includedFiles
      .map((f) => ({ loc: sitemapLocFromRelPath(f), lastmod }))
      // Avoid duplicates when both /tr/index.html and /tr/ resolve similarly.
      .filter((value, index, array) => array.findIndex((x) => x.loc === value.loc) === index);

    const xml =
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
      urls
        .map((u) => `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod></url>`)
        .join('\n') +
      '\n</urlset>\n';

    const robots = `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;

    await fs.writeFile(nodePath.join(distAbs, 'sitemap.xml'), xml, 'utf8');
    await fs.writeFile(nodePath.join(distAbs, 'robots.txt'), robots, 'utf8');
  })();
});

// HTML
gulp.task("html:build", function () {
  return gulp
    .src(path.src.html, { base: "source" })
    .pipe(
      fileinclude({
        basepath: path.src.incdir,
      })
    )
    .pipe(
      htmlmin({
        collapseWhitespace: false,
        removeComments: true,
      })
    )
    .pipe(
      comments(`
    WEBSITE: https://gelistirici.com
    TWITTER: https://x.com/gelistirici
    FACEBOOK: https://www.facebook.com/gelistirici.bilisim
    GITHUB: https://github.com/dolunay
    LINKEDIN: https://www.linkedin.com/in/gelistirici/
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
    TWITTER: https://x.com/gelistirici
    FACEBOOK: https://www.facebook.com/gelistirici.bilisim
    GITHUB: https://github.com/dolunay
    LINKEDIN: https://www.linkedin.com/in/gelistirici/
    `)
    )
    .pipe(gulp.dest(path.build.dirDev + "tr/css/"))
    .pipe(gulp.dest(path.build.dirDev + "en/css/"))
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
    TWITTER: https://x.com/gelistirici
    FACEBOOK: https://www.facebook.com/gelistirici.bilisim
    GITHUB: https://github.com/dolunay
    LINKEDIN: https://www.linkedin.com/in/gelistirici/
  `)
    )
    .pipe(gulp.dest(path.build.dirDev + "tr/js/"))
    .pipe(gulp.dest(path.build.dirDev + "en/js/"))
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
    .pipe(gulp.dest('dist/tr/images/'))
    .pipe(gulp.dest('dist/en/images/'))
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
    .pipe(gulp.dest(path.build.dirDev + "tr/plugins/"))
    .pipe(gulp.dest(path.build.dirDev + "en/plugins/"))
    .pipe(
      bs.reload({
        stream: true,
      })
    );
});

// Other files like favicon, php, sourcele-icon on root directory
gulp.task("others:build", function () {
  return gulp
    .src(path.src.others)
    .pipe(gulp.dest(path.build.dirDev))
    .pipe(gulp.dest(path.build.dirDev + "tr/"))
    .pipe(gulp.dest(path.build.dirDev + "en/"));
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
    "seo:build",
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
    "clean",
    "html:build",
    "js:build",
    "scss:build",
    //"images:build",
    "imagemin:build",
    "plugins:build",
    "seo:build"
  )
);
