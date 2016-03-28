var path = require('path');
var gulp = require('gulp');

var processAll = require('./libs/processAll');
var dir = require('./libs/dir');

gulp.task('default', function(){
	processAll();
});
