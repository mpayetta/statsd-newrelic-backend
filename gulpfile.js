'use strict';

var gulp = require('gulp');
var linter = require('gulp-jslint');

gulp.task('lint', function() {
    gulp.src(['lib/**/*.js', 'test/**/*.js'])
        .pipe(linter());
});
