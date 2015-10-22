/*
* @Author: justinwebb
* @Date:   2015-09-20 14:14:33
* @Last Modified by:   justinwebb
* @Last Modified time: 2015-09-23 17:40:31
*/

'use strict';
var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var sync = require('browser-sync');
var config = require('./build.config.js');
console.log('Config: ', config, '\n');

//------------------------------------------------------------------
// Tasks
//------------------------------------------------------------------

/**
 * Concatenate individual source files to 'helpers.js'
 */
gulp.task('helpers', function () {
  return gulp.src(config.source.jsHelpers)
    .pipe(sourcemaps.init())
    .pipe(concat('helpers.js', {newLine: ';'}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.js));
});

gulp.task('sass', function () {
  return gulp.src(config.source.scss)
    .on('error', sass.logError)
    .pipe(sourcemaps.init())
    .pipe(sass({
        includePaths: [
          'app/css/scss',
          config.importPath.fontawesomeSass
        ],
        sourcemap: true
      })
    )
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.css))
    .pipe(sync.reload({stream: true}));
});

/**
 * Watch files source files and files linked to 'index.html'
 * for changes
 */
gulp.task('startup', function (cb) {
  var watchPaths = config.source.js
    .concat(config.index);

  sync.init({
    server: config.app
  });

  gulp.watch(config.source.scss, ['sass']);
  gulp.watch(config.source.jsHelpers, ['helpers']);
  gulp.watch(watchPaths).on('change', sync.reload);

  cb();
});


gulp.task('default', ['sass', 'helpers', 'startup']);
