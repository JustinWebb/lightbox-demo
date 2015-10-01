module.exports = {
  app: 'app',
  css: 'app/css',
  js: 'app/js',
  index: 'app/index.html',
  source: {
    js: [
      '!app/js/vendor',
      'app/js/helpers.js',
      'app/js/main.js'
    ],
    jsHelpers: ['app/js/helpers/**/*.js'],
    scss: ['app/css/scss/**/*.scss']
  }
};
