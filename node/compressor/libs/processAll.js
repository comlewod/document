/* 
 *	任务布置
 */

var gulp = require('gulp');
var path = require('path');
var fsHandler = require('./fsHandler');
var dir = require('./dir');

var delOutputFile = function(callback){
	var _path = [];
	_path.push(path.join(dir.output, '*.*'));
	_path.push(path.join(dir.haha, '*.*'));

	fsHandler.unlink(_path, callback);
};

var start = function(){
	console.log('准备开始打包');
};
var processAll = function(){
	delOutputFile(start);
};

module.exports = processAll;
