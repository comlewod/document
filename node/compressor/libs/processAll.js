/* 
 *	任务布置
 */

var gulp = require('gulp');
var path = require('path');
var fsHandler = require('./fsHandler');
var processLibs = require('./processLibs');
var resolvePath = require('./resolvePath');
var gulpFiles = require('./gulp-files');
var dir = require('./dir');

//需要打包文件的路径
var pagePath = [
	path.join(dir.template, '*', '*', '*.php'),
	path.join(dir.template, 'layouts', '*.php')
];

//删除output里的文件
var delOutputFile = function(callback){
	var _path = [];
	console.log('准备开始删除output里的文件');
	//打包前删除output里的文件
	_path.push(path.join(dir.output, '*.*'));
	//_path.push(path.join(dir.haha, '*.*'));

	fsHandler.unlink(_path, callback);
};

var start = function(){
	console.log('准备开始打包');
	gulp.src(pagePath)
	.pipe(gulpFiles(function(files){
		for(var i=0; i<files.length; i++){
			process(files[i].path);
		}
	}));
};

var process = function(src){
	//打包layouts时 

	//获取layout层等信息
	if( src.indexOf('/global/') > -1 || src.indexOf('/layouts/') > -1 ){
	//if( src.indexOf('\\global\\') > -1 || src.indexOf('\\layouts\\') > -1 ){
		var info = resolvePath(src);
		var tplDir = info.tpl.dir;

		//从layouts文件夹里获取项目名称
		//if( src.indexOf('\\layouts\\') > -1 ){
		if( src.indexOf('/layouts/') > -1 ){
			tplDir = info.filename;
		}
		//tplDir为项目名称
		new processLibs(tplDir); //开始打包Libs，以及该项目里的内容
	}
};
var processAll = function(){
	delOutputFile(start);
};

module.exports = processAll;
