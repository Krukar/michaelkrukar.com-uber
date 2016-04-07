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

gulp.task('concat', function(){
	return gulp.src(['node_modules/jquery/dist/jquery.min.js',
		'node_modules/snapsvg/dist/snap.svg-min.js',
		'node_modules/angular/angular.min.js',
		'js/app.js',
		'js/ngMapFactory.js',
		'js/ngMap.js',
		'js/ngAnimator.js'])
	.pipe(concat('scripts.js'))
	.pipe(gulp.dest('js'));
});

gulp.task('default', ['css'], function() {
	gulp.watch(['scss/**/*.scss'], ['css']);
});