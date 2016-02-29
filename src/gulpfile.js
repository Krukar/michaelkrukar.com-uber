var gulp = require('gulp'),
sass = require('gulp-sass');

gulp.task('sass', function () {
	return gulp.src('./scss/style.scss')
	.pipe(sass({
		outputStyle: 'compressed'
	})
	.on('error', sass.logError))
	.pipe(gulp.dest('../'));
});

gulp.task('default', ['sass'], function() {
	gulp.watch(['scss/**/*.scss', 'js/**/*.scss'], ['sass']);
});