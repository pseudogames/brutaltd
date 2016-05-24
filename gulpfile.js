'use strict';

var gulp = require('gulp'),
	del  = require('del'),
	exec = require('child_process').exec,
	scp = require('gulp-scp2'),
	fs = require('fs'),
	clean = require('gulp-clean'),
	webpack = require('webpack-stream'),
	merge = require('merge-stream'),
	plumber = require('gulp-plumber'),
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
		.src('./build/index.html')
		.pipe(connect.reload())
	;
});


gulp.task('clean', function(){
	return gulp
		.src('build', {read: false})
	    .pipe(clean())
	;
});

function build() {
	var html = gulp.src('app/index.html')
			.pipe(gulp.dest('build'))

	var js = gulp.src('app/js/main.js')
			.pipe(plumber())
			.pipe(webpack(require('./webpack.config.js')))
			.pipe(gulp.dest('build/js'));

	return merge(html, js);
}

gulp.task('clean-build', ['clean'], build);
gulp.task('build', build);

gulp.task('watch', ['clean-build'], function () {
	gulp.watch(['./app/index.html','./app/js/*.js'], ['build']);
	gulp.watch(['./build/js/*.js'], ['reload']);
});

gulp.task('release', ['clean-build'], function (next) {
	gulp
		.src('build/**')
		.pipe(scp({
			host: 'pseudogames.com',
			username: 'brutaltd',
			dest: 'web/',
			privateKey: fs.readFileSync(process.env.HOME+"/.ssh/id_rsa")
		}))
	;
});

gulp.task('default', ['watch','connect']);
