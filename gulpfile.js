'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

gulp.task('sass', function () {
    return gulp.src('./public/sass/**/*.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('./public/css'));
});

gulp.task('scripts:controller', function () {
    return gulp
        .src('./public/js/controllers/**/*.js')
        .pipe(concat('controllers.min.js'))
        //.pipe(uglify())
        .pipe(gulp.dest('./public/js'));
});
gulp.task('scripts:services', function () {
    return gulp
        .src('./public/js/services/**/*.js')
        .pipe(concat('services.min.js'))
        //.pipe(uglify())
        .pipe(gulp.dest('./public/js'));
});

gulp.task('csswatch', function () {
    gulp.watch('./public/sass/**/*.scss', ['sass']);
});

gulp.task('servicewatch', function () {
    gulp.watch('./public/js/services/**/*.js', ['scripts:services']);
});

gulp.task('controllerwatch', function () {
    gulp.watch('./public/js/controllers/**/*.js', ['scripts:controller']);
});

gulp.task('default', ['csswatch', 'servicewatch', 'controllerwatch', 'scripts:services', 'scripts:controller']);