var path = require('path');
var gulp = require('gulp');
var resolvePath = require('./resolvePath');
var dir = require('./dir');
var config = require('./config');
var gulpFile = require('./gulp-files');

/* 查找子页面下的widget，比如global下的footer、header */
var widgetMap = function(src, callback){
	var _widgetMap = {};//记录widget，比如post下的comment、page
	var info = resolvePath(src);

	gulp.src(path.join(dir.pages, info.tpl.dir, info.tpl.name, '*', '*.php')).pipe(gulpFile(function(files){
		var info;
		var content;
		var len = files.length;

		for(var i=0; i<len; i++ ){
			info = resolvePath(files[i].path);
			content = String(files[i].contents);
			//获取该widget下所需要的其它widget
			_widgetMap[info.widgetname] = findWidget(content);
		}
		callback && callback(_widgetMap);
	}));
};

//搜索文件文本内的widget，比如index.php插入了{widget 'battery}
var findWidget = function(content){
	var widgets = {};
	var ret = [];
	var matches = content.match(config.widget_reg) || [];

	for( var i=0; i<matches.length; i++ ){
		var name = matches[i].replace(config.widget_reg, '$1');
		name = name.split(',')[0].replace(config.widget_name_reg, "");
		if( !!!widgets[name] ){
			widgets[name] = 1;
		}
	}
	for( var i in widgets ){
		ret.push(i);
	}
	return ret;
};

module.exports = widgetMap;
