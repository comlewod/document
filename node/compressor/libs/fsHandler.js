/*
 *	文件操作——删除
 */

var fs = require('fs');
var gulp = require('gulp');
var gulpFiles = require('./gulp-files');

var fsHandler = {
	write: function(src, content, callback){
		fs.writeFile(src, content, function(err){
			if( err ) throw err;
			callback && callback();
		});
	},
	unlink: function(src, callback){
		gulp.src(src)
		//通过gulpFiles里的through模块遍历src目录下的所有文件并输出（同时through模块可以把vinly流转成可读可写流）
		//这里的function(files)为gulpFiles的参数fn
		.pipe(gulpFiles(function(files){
			var len = files.length;
			var mark = len;

			if( len ){
				for(var i=0, l=len; i<l; i++){
					//fs.exists(path, function(exists){}); 使index为每一个不同的i值
					fs.exists(files[i].path, (function(index){
						return function(exists){
							if( exists ){
								unlink(index);
							}
						}
					})(i));
					//这里不适用同步，因为前面的tplDir的变化是异步，会导致这个unlink方法后面有错
					/*if( fs.existsSync(files[i].path) ){
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
					}*/
				}
				function unlink(i){
					fs.unlink(files[i].path, function(err){
						if( err ) {
							//throw err;
						}
						mark--;
						if( mark == 0 ) callback && callback();
					});
				}
			} else {
				callback && callback();
			}
		}));
	}
};

module.exports = fsHandler;
