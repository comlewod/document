/*
 *	该模块应该放在node_modules里，用于处理文件流，但这里先将它作为模块；gulp对象流转成可读写流，通过through2来遍历符合匹配的所有文件
 */
var through = require('through2');

module.exports = function(fn){
	var files = [];
	//file是文件流里的每个文件，通过流来得到
	var throughObj = through.obj(function(file, enc, callback){
		files.push(file);
		callback();
	}, function(callback){
		//files为流里的文件集合
		fn && fn(files);
		callback();
	});
	return throughObj;
};
