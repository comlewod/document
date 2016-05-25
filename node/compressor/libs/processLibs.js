var gulp = require('gulp');
var path = require('path');

var dir = require('./dir');

var processor = require('./processor');
var Libs = function(tplDir){
	console.log('1.打包libs：' + tplDir);

	var startTime = +new Date();//转成时间戳

	var initialize = function(){
		console.log(dir);
		var process = new processor({
			del_old_file: {
				//js: path.join(dir.page, 'js', 'libs_'),
				//css: path.join(dir.page, 'js', 'libs')
			},
		});
		process.start();
	};
	initialize();
};
module.exports = Libs;
