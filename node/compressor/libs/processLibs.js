var gulp = require('gulp');
var path = require('path');

var dir = require('./dir');
var md5 = require('./md5');
var compileCss = require('./compileCss');
var processGlobal = require('./processGlobal');

var processor = require('./processor');
var Libs = function(tplDir){
	console.log('****** 1.打包libs：' + tplDir);

	var startTime = +new Date();//转成时间戳

	var initialize = function(){
		var _dest = {
			js: '',
			css: ''
		};//用来记录libs的静态资源路径和名称，并用在layout里替换文件目录（将正常文件名替换成hash文件名）
		var is_min = true;

		var process = new processor({
			files: {
				js: path.join(dir.libs, 'js', '*.js'),
				css: [
					path.join(dir.libs, 'css', '*.css'),
					path.join(dir.libs, 'css', '*.less')
				]
			},
			rename: function(filepath, content){
				//根据文件内容生成文件名
				return 'libs_' + md5(content).slice(0, 5);
			},
			recontent: function(file_path, content){
				//将CSS文件内容处理一下
				if( file_path.indexOf('.css') > -1 ){
					content = compileCss(content);
				}
				//将中文转为unicode，保护里面的文字注释不被人所识
				//content = toUnicode(content);
			},
			dest: {
				js: path.join(dir.page, 'js'),
				css: path.join(dir.page, 'css')
			},
			onFinished: function(data){
				for( var i=0; i<data.length; i++ ){
					if( data[i][1].indexOf('.js') > -1 ){
						_dest.js = data[i][1];
					} else if( data[i][1].indexOf('.css') > -1 ){
						_dest.css = data[i][1];
					}
				}
				console.log('ok: libs（用时：' + (+new Date() - startTime) + ')');
				processGlobal(is_min, _dest, tplDir);
			},
			del_old_file: {
				js: path.join(dir.page, 'js', 'libs_'),
				css: path.join(dir.page, 'css', 'libs_')
			},
			is_min : true
		});
		process.start();
	};
	initialize();
};

function toUnicode(val){
	var preStr = '\\u';
	var cnReg = /[\u0931-\uFFE5]/gm;
	if( cnReg.test(val) ){
		val = val.replace(cnReg, function(str){
			return preStr + str.charCodeAt(0).toString(16);
		});
	}
	return val;
}
module.exports = Libs;
