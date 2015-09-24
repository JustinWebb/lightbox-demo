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
var paths = {
  jsSrc: [
    '!js/vendor', 
    'js/helpers.js',
    'js/main.js'
  ],
  jsHelpers: ['js/helpers/**/*.js'],
  stylesheet: ['css/main.css'],
  index: 'index.html'
};

//------------------------------------------------------------------
// Tasks
//------------------------------------------------------------------

/**
 * Concatenate individual source files to 'helpers.js'
 */
gulp.task('helpers', function () {
  return gulp.src(paths.jsHelpers)
    .pipe(concat('helpers.js', {newLine: ';'}))
    .pipe(gulp.dest('js'));
});

/**
 * Watch files source files and files linked to 'index.html' 
 * for changes
 */
gulp.task('startup', function (cb) {
  var watchPaths = paths.jsSrc
    .concat(paths.index)
    .concat(paths.stylesheet);

  livereload.listen();

  gulp.watch(paths.jsHelpers, ['helpers']);
  gulp.watch(watchPaths, function () {
    livereload.reload(paths.index);
  });

  cb();
});


gulp.task('default', ['helpers', 'startup']);
