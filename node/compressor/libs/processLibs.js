var gulp = require('gulp');
var path = require('path');

var dir = require('./dir');

var processor = require('./processor');
var Libs = function(tplDir){
	console.log('1.打包libs：' + tplDir);

	var startTime = +new Date();//转成时间戳

	var initialize = function(){
		var process = new processor({
			files: {
				js: path.join(dir.libs, 'js', '*.js'),
				css: [
					path.join(dir.libs, 'css', '*.css'),
					path.join(dir.libs, 'css', '*.less')
				]
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
module.exports = Libs;
