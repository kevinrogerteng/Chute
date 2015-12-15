var gulp = require('gulp'),
	nodemon = require('gulp-nodemon')

gulp.task('default', ['watch']);

gulp.task('server', function () {
  nodemon({
    script: 'server.js'
  , ext: 'html css js'
  , env: { 'NODE_ENV': 'development' }
  })
});