var gulp = require('gulp'),
sass = require('gulp-sass'),
concat = require('gulp-concat');

gulp.task('css', function () {
	return gulp.src('./scss/style.scss')
	.pipe(sass({
		outputStyle: 'compressed'
	})
	.on('error', sass.logError))
	.pipe(gulp.dest('../'));
});

gulp.task('default', ['css'], function() {
	gulp.watch(['scss/**/*.scss'], ['css']);
});