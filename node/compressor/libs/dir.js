/*
 *	路径集合，包括项目路径，layout、output等文件的路径
 */

var path = require('path');
var fs = require('fs');
var dir = {};

dir.root = '../../';//注意这里的路径为返回上两级为根目录，即dir.js模块的调用只能在compressor目录下
dir.static = path.join(dir.root, 'static');

//需要打包的文件
dir.template = path.join(dir.root, 'pages');

//静态资源，包括js  css img
dir.page = path.join(dir.static, 'page');

//打包完成的文件存放目录
dir.output = path.join(dir.root, 'output');

dir.haha = path.join(dir.root, 'haha');

//console.log(__dirname); 
//无论在哪里调用该模块，这里的__dirname始终是该模块的位置

//验证路径文件是否存在，没有的话新建文件
for( var i in dir ){
	//这里不用fs.exists(path, callback)方法，该方法已过时且用法不同于existsSync，并且不能正确返回判断
	if( !fs.existsSync(dir[i]) ){
		fs.mkdirSync(dir[i]);
	}
}

module.exports = dir;
