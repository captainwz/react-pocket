var gulp = require('gulp');
var babel = require('gulp-babel');

gulp.task('default', function() {
    gulp.src('./src/redollar/index.js')
        .pipe(babel())
        .pipe(gulp.dest('./lib/redollar'))
});

gulp.task('interpreter', function() {
    gulp.src('./src/interpreter/*.js')
        .pipe(babel())
        .pipe(gulp.dest('./lib/interpreter'))
});