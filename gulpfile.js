'use strict';

var gulp = require('gulp');
var linter = require('gulp-jslint');
var mocha = require('gulp-mocha');
var handleMochaError = function (err) {
    console.log('Mocha encountered an error, exiting with status 1');
    console.log('Error:', err.message);
    process.exit(1);
};


gulp.task('lint', function () {
    gulp.src(['lib/**/*.js', 'test/**/*.js'])
        .pipe(linter());
});

gulp.task('mocha', function () {
    var mochaErr;
    return gulp.src(['test/**/*.js'], {read: false})
        .pipe(mocha({reporter: 'nyan'}))
        .on('error', function (err) {
            console.error('ERROR:', err.message);
            console.error('Stack:', err.stack);
            mochaErr = err;
        })
        .on('end', function () {
            if (mochaErr) return handleMochaError(mochaErr);
            // Force mocha to exit, because gulp-mocha is stupid.
            process.exit();
        });
    ;
});
