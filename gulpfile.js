'use strict';

var gulp = require('gulp'),
	del  = require('del'),
	exec = require('child_process').exec,
	connect = require('gulp-connect');

gulp.task('connect', function() {
	connect.server({
		root: 'build',
		livereload: true,
		port: 6660
	});
});

gulp.task('reload', function () {
	gulp
		.src('./build/*.html')
		.pipe(connect.reload());
});


gulp.task('clean', function(){
	del.sync([ 'build/**' ]);
});

gulp.task('copy', function () {
	gulp
		.src('app/index.html')
		.pipe(gulp.dest('build'));
});

gulp.task('watch', ['clean', 'build'], function () {
	gulp.watch(['./app/index.html','./app/js/*.js'], ['build']);
	gulp.watch(['./build/js/*.js'], ['reload']);
});

gulp.task('build', ['clean','copy'], function () {
	exec('node node_modules/webpack/bin/webpack.js', function (err, stdout, stderr) {
		console.log(stdout);
		console.log(stderr);
	});
});

gulp.task('default', ['watch','connect']);
