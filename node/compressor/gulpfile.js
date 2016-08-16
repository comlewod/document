var path = require('path');
var gulp = require('gulp');

var processAll = require('./libs/processAll');
var dir = require('./libs/dir');
var resolvePath = require('./libs/resolvePath');
var tasks = require('./libs/tasks');

var processLibs = require('./libs/processLibs');
var processWidget = require('./libs/processWidget');

gulp.task('watch', function(){
	var files = [
		//widget，ex：/pages/koala/post/select/select.js
		path.join(dir.pages, '*', '*', '*', '*.js'),
		path.join(dir.pages, '*', '*', '*', '*.css'),
		path.join(dir.pages, '*', '*', '*', '*.less'),
		path.join(dir.pages, '*', '*', '*', '*.php'),

		//页面，ex：/pages/koala/post/index.php
		path.join(dir.pages, '*', '*', '*.php'),

		//lib
		path.join(dir.libs, '*', '*.js'),
		path.join(dir.libs, '*', '*.css'),
		path.join(dir.libs, '*', '*.less'),

		//layout
		path.join(dir.pages, 'layouts', '*.php'),
	];

	var task = tasks('all', true);

	gulp.watch(files, function(file){
		task.pushTask(function(){
			process(file.path);
		});
	});
});

var process = function(src){
	if( src.indexOf('/libs/') > -1 || src.indexOf('/global/') > -1 || src.indexOf('/layouts/') > -1 ){
		var info = resolvePath(src);
		var tplDir = info.tpl.dir;

		//从layouts文件夹里获取项目名称
		if( src.indexOf('/layouts/') > -1 ){
			tplDir = info.filename;
		}
		if( src.indexOf('/libs/') > -1 ){
			tplDir = '';
		}
		//tplDir为项目名称
		new processLibs(tplDir); 
	} else {
		//项目里的其它页面
		new processWidget(src);
	}
};

gulp.task('default', function(){
	processAll();
	gulp.run('watch');
});
