/*
* @Author: justinwebb
* @Date:   2015-09-20 14:14:33
* @Last Modified by:   justinwebb
* @Last Modified time: 2015-09-23 17:40:31
*/

'use strict';
var gulp = require('gulp');
var livereload = require('gulp-livereload');
var concat = require('gulp-concat');
var sync = require('browser-sync');
var config = require('./build.config.js');
console.log('Config: ', config);

//------------------------------------------------------------------
// Tasks
//------------------------------------------------------------------

/**
 * Concatenate individual source files to 'helpers.js'
 */
gulp.task('helpers', function () {
  return gulp.src(config.jsHelpers)
    .pipe(concat('helpers.js', {newLine: ';'}))
    .pipe(gulp.dest('js'));
});

/**
 * Watch files source files and files linked to 'index.html'
 * for changes
 */
gulp.task('startup', function (cb) {
  var watchPaths = config.jsSrc
    .concat(config.index)
    .concat(config.stylesheet);

  sync.init({
    server: config.app
  });

  gulp.watch(config.jsHelpers, ['helpers']);
  gulp.watch(watchPaths).on('change', sync.reload);

  cb();
});


gulp.task('default', ['helpers', 'startup']);
