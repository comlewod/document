/* 
 *	任务布置
 */

var gulp = require('gulp');
var path = require('path');
var fsHandler = require('./fsHandler');
var gulpFiles = require('./gulp-files');
var dir = require('./dir');

//需要打包文件的路径
var pathPage = [
	path.join(dir.template, '*', '*', '*.php')
];

var delOutputFile = function(callback){
	var _path = [];
	//打包前删除output里的文件
	_path.push(path.join(dir.output, '*.*'));
	//_path.push(path.join(dir.haha, '*.*'));

	fsHandler.unlink(_path, callback);
};

var start = function(){
	console.log('准备开始打包');
	gulp.src(pathPage)
	.pipe(gulpFiles(function(files){
		for(var i=0; i<files.length; i++){
		}
	}));
};
var processAll = function(){
	delOutputFile(start);
};

module.exports = processAll;