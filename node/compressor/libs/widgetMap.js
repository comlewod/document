var path = require('path');
var gulp = require('gulp');
var resolvePath = require('./resolvePath');
var dir = require('./dir');
var gulpFile = require('./gulp-files');

//文件中插入widget
var findWidget = function(content){
};

/* 查找子页面下的widget，比如global下的footer、header */
var widgetMap = function(src, callback){
	var _widgetMap = {};//记录widget，比如post下的comment、page
	var info = resolvePath(src);

	gulp.src(path.join(dir.template, info.tpl.dir, info.tpl.name, '*', '*.php')).pipe(gulpFile(function(files){
		var info;
		var content;
		var len = files.length;

		for(var i=0; i<len; i++ ){
			info = resolvePath(files[i].path);
			content = String(files[i].contents);
			//_widgetMap[info.widgetname] = findWidget(content);
			_widgetMap[info.widgetname] = [];
		}
		callback && callback(_widgetMap);
	}));
};

module.exports = widgetMap;
