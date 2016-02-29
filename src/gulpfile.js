var gulp = require('gulp'),
sass = require('gulp-sass'),
concat = require('gulp-concat'),
uglify = require('gulp-uglify'),
rename = require('gulp-rename');

gulp.task('sass', function () {
	return gulp.src('./scss/style.scss')
	.pipe(sass({
		outputStyle: 'compressed'
	})
	.on('error', sass.logError))
	.pipe(gulp.dest('../'));
});

gulp.task('concat', function() {
	return gulp.src(['node_modules/jquery/dist/jquery.min.js',
		'node_modules/snapsvg/dist/snap.svg-min.js',
		'js/app.js'])
	.pipe(concat('uber.js'))
	.pipe(gulp.dest('js'));
});

gulp.task('uglify', ['concat'], function() {
	return gulp.src('js/uber.js')
	.pipe(uglify({
		compress:{
			drop_console: true
		}
	}))
	.pipe(rename({
		extname: '.min.js'
	}))
	.pipe(gulp.dest('../'));
});

gulp.task('default', ['sass', 'concat', 'uglify'], function() {
	gulp.watch('js/**/*.js', ['concat']);
	gulp.watch('js/tv.js', ['uglify']);
	gulp.watch(['scss/**/*.scss', 'js/**/*.scss'], ['sass']);
});