const gulp = require("gulp");
const del = require("del");
const sass = require("gulp-sass");
const nunjucksRender = require("gulp-nunjucks-render");
const browserify = require("browserify");
const babelify = require("babelify");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const cleanCSS = require("gulp-clean-css");
const autoprefixer = require("gulp-autoprefixer");
const uglify = require("gulp-uglify");
const htmlmin = require("gulp-htmlmin");
const markdown = require("gulp-markdown");
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();

const shared = {
  clear: () => {
    return del(["dist"]);
  },
  assets: () => {
    return gulp.src("src/img/**/*").pipe(gulp.dest("dist/img"));
  },
  help: (done) => {
    console.info(
      "###############################################################################"
    );
    console.info("");
    console.info("Help:");
    console.info("");
    console.info("*gulp dev* to development mode");
    console.info("*gulp build* to deployment mode");
    console.info("*gulp clear* to clear dist folder");
    console.info("");
    console.info(
      "###############################################################################"
    );

    done();
  },
};

const dev = {
  html: () => {
    return gulp
      .src("src/*.html")
      .pipe(
        nunjucksRender({
          path: ["src/"],
        })
      )
      .pipe(gulp.dest("dist"));
  },
  markdown: () => {
    return gulp
      .src("src/policies/**/*.md")
      .pipe(markdown())
      .pipe(gulp.dest("dist/policies"));
  },
  extras: () => {
    return gulp
      .src(["src/*.txt", "src/*.webmanifest", "src/*.ico", "src/*.png"])
      .pipe(gulp.dest("dist"));
  },
  styles: () => {
    return gulp
      .src("src/scss/styles.scss")
      .pipe(sourcemaps.init())
      .pipe(sass().on("error", sass.logError))
      .pipe(
        autoprefixer({
          cascade: false,
        })
      )
      .pipe(sourcemaps.write("../maps"))
      .pipe(gulp.dest("dist/css"));
  },
  scripts: () => {
    return browserify({
      entries: "src/js/main.js",
      debug: true,
    })
      .transform(
        babelify.configure({
          presets: ["@babel/preset-env"],
        })
      )
      .bundle()
      .pipe(source("main.js"))
      .pipe(gulp.dest("dist/js"));
  },
  reload: (done) => {
    browserSync.reload();
    return done();
  },
  serve: () => {
    browserSync.init({
      server: {
        baseDir: "dist",
      },
    });

    gulp.watch("src/js/**/*.js", gulp.series(dev.scripts, dev.reload));
    gulp.watch("src/scss/**/*.scss", gulp.series(dev.styles, dev.reload));
    gulp.watch("src/**/*.html", gulp.series(dev.html, dev.reload));
    gulp.watch("src/**/*.md", gulp.series(dev.markdown, dev.reload));
  },
};

const build = {
  html: () => {
    return gulp
      .src("src/*.html")
      .pipe(
        nunjucksRender({
          path: ["src/"],
        })
      )
      .pipe(
        htmlmin({
          collapseWhitespace: true,
        })
      )
      .pipe(gulp.dest("dist"));
  },
  markdown: () => {
    return gulp
      .src("src/policies/**/*.md")
      .pipe(markdown())
      .pipe(
        htmlmin({
          collapseWhitespace: true,
        })
      )
      .pipe(gulp.dest("dist/policies"));
  },
  extras: () => {
    return gulp
      .src(["src/*.txt", "src/*.webmanifest", "src/*.ico", "src/*.png"])
      .pipe(gulp.dest("dist"));
  },
  styles: () => {
    return gulp
      .src("src/scss/styles.scss")
      .pipe(sass().on("error", sass.logError))
      .pipe(cleanCSS())
      .pipe(
        autoprefixer({
          cascade: false,
        })
      )
      .pipe(gulp.dest("dist/css"));
  },
  scripts: () => {
    return browserify({
      entries: "src/js/main.js",
      debug: true,
    })
      .transform(
        babelify.configure({
          presets: ["@babel/preset-env"],
        })
      )
      .bundle()
      .pipe(source("main.js"))
      .pipe(buffer())
      .pipe(uglify())
      .pipe(gulp.dest("dist/js"));
  },
};

//mainTasks exposed to gulp
gulp.task("clear", shared.clear),
  gulp.task("help", shared.help),
  gulp.task(
    "dev",
    gulp.series(
      shared.clear,
      gulp.parallel(
        dev.html,
        dev.markdown,
        dev.extras,
        dev.styles,
        dev.scripts,
        shared.assets
      ),
      dev.serve
    )
  ),
  gulp.task(
    "build",
    gulp.series(
      shared.clear,
      gulp.parallel(
        build.html,
        build.markdown,
        build.extras,
        build.styles,
        build.scripts,
        shared.assets
      )
    )
  ),
  //default dev
  gulp.task(
    "default",
    gulp.series(
      shared.clear,
      gulp.parallel(
        dev.html,
        dev.markdown,
        dev.extras,
        dev.styles,
        dev.scripts,
        shared.assets
      ),
      dev.serve
    )
  );
