/* 
* @Author: justinwebb
* @Date:   2015-09-20 14:14:33
* @Last Modified by:   justinwebb
* @Last Modified time: 2015-09-20 14:36:55
*/

'use strict';
var gulp = require('gulp');
var livereload = require('gulp-livereload');
var paths = {
  js: ['!js/vendor', 'js/**/*.js'],
  index: 'index.html'
};

//-----------------------------------------------------------------------------
// Tasks
//-----------------------------------------------------------------------------
gulp.task('default', function () {
  var watchPaths = paths.js.concat(paths.index);

  livereload.listen();

  gulp.watch(watchPaths, function () {
    livereload.reload(paths.index);
  });
});