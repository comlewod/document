/*
 *	gulp对象流转成可读写流	
 */
var through = require('through2');

module.exports = function(fn){
	var files = [];
	var throughObj = through.obj(function(file, enc, callback){
		files.push(file);
		callback();
	}, function(callback){
		fn && fn(files);
		callback();
	});
	return throughObj;
};
