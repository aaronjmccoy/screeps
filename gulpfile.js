var gulp = require('gulp');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglifyjs');
var rename = require('gulp-rename');
var screeps = require('gulp-screeps');
const babel = require('gulp-babel');
var credentials = require('./credentials.js');
// Lint Task
gulp.task('lint', function () {
 return gulp.src('lib/**/*.js')
  .pipe(jshint())
  .pipe(jshint.reporter('default'));
});

// Concatenate & Minify JS
gulp.task('scripts', function () {
 return gulp.src('lib/**/*.js')
  .pipe(concat('concat.js'))
  .pipe(gulp.dest('dist/'))
  .pipe(rename('main.js'))
  .pipe(babel({
   presets: ['es2015']
  }))
  .pipe(gulp.dest('dist/'))
  .pipe(screeps(credentials));
});

function createErrorHandler(name) {
 return function (err) {
  console.error('Error from ' + name + ' in compress task', err.toString());
 };
}
// Watch Files For Changes
gulp.task('watch', function () {
 gulp.watch('lib/**/*.js', ['lint', 'scripts']);
});

// Default Task
gulp.task('default', ['lint', 'scripts', 'watch']);
