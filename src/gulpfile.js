var gulp = require('gulp'),
sass = require('gulp-sass'),
concat = require('gulp-concat'),
uglify = require('gulp-uglify');

gulp.task('css', function () {
	return gulp.src('./scss/style.scss')
	.pipe(sass({
		outputStyle: 'compressed'
	})
	.on('error', sass.logError))
	.pipe(gulp.dest('../'));
});

gulp.task('js', function() {
  return gulp.src(['node_modules/jquery/dist/jquery.min.js',
		'node_modules/snapsvg/dist/snap.svg-min.js',
		'node_modules/angular/angular.min.js',
		'js/app.js',
		'js/ngMapFactory.js',
		'js/ngMap.js',
		'js/ngAnimator.js'])
    .pipe(concat('scripts.js'))
    .pipe(uglify({
    	compress:{
    		drop_console: true
    	},
    	mangle: false
    }))
    .pipe(gulp.dest('../'));
});

gulp.task('default', ['css', 'js'], function() {
	gulp.watch(['scss/**/*.scss'], ['css']);  
	gulp.watch(['js/**/*.js'], ['js']);
});