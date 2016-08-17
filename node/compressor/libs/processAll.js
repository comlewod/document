/* 
 *	任务布置
 */

var gulp = require('gulp');
var path = require('path');
var fsHandler = require('./fsHandler');
var processLibs = require('./processLibs');
var processWidget = require('./processWidget');
var resolvePath = require('./resolvePath');
var gulpFiles = require('./gulp-files');
var tasks = require('./tasks');
var dir = require('./dir');

//需要打包文件的路径
var pagePath = [
	path.join(dir.pages, '*', '*', '*.php'),//ex: pages/koala/post/index.php
	path.join(dir.pages, 'layouts', '*.php')
];
//新建一个名为all的任务，该任务包含 lib 和项目的 layout 和 global 的打包
var task = tasks('all', true);

//删除output里的文件
var delOutputFile = function(callback){
	var _path = [];
	//console.log('准备开始删除output里的文件');
	//打包前删除output里的文件
	_path.push(path.join(dir.output_widget, '*.*'));
	_path.push(path.join(dir.output_pages, '*.*'));

	fsHandler.unlink(_path, callback);
};

var start = function(){
	gulp.src(pagePath).pipe(gulpFiles(function(files){
		for(var i=0; i<files.length; i++){
			var fn = function(index){
				return function(){
					process(files[index].path);
				}
			};
			task.pushTask(fn(i));
		}
	}));
};

var process = function(src){
	//打包layouts时 

	if( src.indexOf('/libs/') > -1 || src.indexOf('/global/') > -1 || src.indexOf('/layouts/') > -1 ){
	//if( src.indexOf('\\global\\') > -1 || src.indexOf('\\layouts\\') > -1 ){
		var info = resolvePath(src);
		var tplDir = info.tpl.dir;

		//从layouts文件夹里获取项目名称
		if( src.indexOf('/layouts/') > -1 ){
			tplDir = info.filename;
		}
		//tplDir为项目名称
		new processLibs(tplDir); 
	} else {
		//项目里的其它页面
		new processWidget(src);
	}
};
var processAll = function(){
	delOutputFile(start);
};

module.exports = processAll;
