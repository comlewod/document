/*
 *	文件操作——删除
 */

var fs = require('fs');
var gulp = require('gulp');
var gulpFiles = require('./gulp-files');

var fsHandler = {
	unlink: function(src, callback){
		gulp.src(src)
		//通过gulpFiles里的through模块遍历src目录下的所有文件并输出（同时through模块可以把vinly流转成可读可写流）
		//这里的function(files)为gulpFiles的参数fn
		.pipe(gulpFiles(function(files){
			if( files.length ){
				var mark = files.length;

				for(var i=0; i<files.length; i++){
					if( fs.existsSync(files[i].path) ){
						//删除文件
						fs.unlink(files[i].path, function(err){
							if(err) throw err;
							mark--;
							//当把所有文件删除后
							if( mark == 0 ) {
								console.log('删除完成');
								callback && callback();
							}
						});
					}
				}
			} else {
				callback && callback();
			}
		}));
	}
};

module.exports = fsHandler;
