var gulp = require('gulp');
var path = require('path');
var uglify = require('gulp-uglify');

var cssmin = require('gulp-minify-css');
var gulpLess = require('gulp-less');
//var imagemin = require('gulp-imagemin');

var gulpFile = require('./gulp-files');
var fsHandler = require('./fsHandler');

var Processor = function(opts){
	this.opts = {
		files: [],
		dest: {},
		rename: function(){ return null; },
		recontent: function(){ return null; },
		onFinished: function(){},
		del_old_file: {},
		is_min: false, //是否压缩
		is_compile: false, //是否编译 less
	};
	//将opts的属性和this.opts默认属性合并
	for( var i in opts ){
		this.opts[i] = opts[i];
	}
};

Processor.prototype = {
	start: function(){
		var self = this;
		this.delOldFile(function(){
			self.writeNewFile();
		});
	},
	writeNewFile: function(){
		var self = this;
		this.compressDetail = [];//二维数组，存放每个处理文件的信息，即原文件路径和处理完后的文件名称，每个文件信息都是一个数组
		this.compressedType = {};

		var _compress = function(type){
			var ext = '.' + type;
			var files = self.opts.files[type];
			var stream = gulp.src(files);
			
			//将所有文件进行编译和压缩
			if( type == 'css' ){
				//对于pages里的less等文件需要编译
				if( self.opts.is_compile ){
					//编译less
					stream = stream.pipe(gulpLess());
				}
			} else if( type == 'js' ){
			}
			
			//进行压缩
			if( self.opts.is_min ){
				if( type == 'js' ){
					stream = stream.pipe(uglify());
				} else if( type == 'css' ){
					stream = stream.pipe(cssmin());
				//} else if( type == 'png' || type == 'jpg' ){
				}
			}

			stream.pipe(gulpFile(function(files){
				//对每个文件再进行处理
				var len = files.length;
				var mark = len;

				if( len == 0 ){
					self.compressedType[type] = 1;//表示该类型的所有文件（比如所有js文件）已经处理完了
					self.onFinished();
					return;
				}
				for( var i=0; i<len; i++ ){
					var file = files[i];
					//获取文件内容
					var content = String(file.contents);
					var newName;
					
					//二次处理文件内容（可自定义的处理），比如CSS3的兼容转换，img图片的地址全文替换
					if( self.opts.recontent ){
						var _content = self.opts.recontent(file.path, content);
						if( _content ) content = _content;
					}
					
					//根据文件内容获得hash文件名
					newName = self.opts.rename(file.path, content) + ext;

					if( self.opts.dest ){
						self.compressDetail.push([file.path, newName]);

						if( type == 'png' || type == 'jpg' || type == 'gif' ){
							//图片文件需要写入原有格式，不使用String
							content = file.contents;
						}
						
						//在static/page里创建静态资源（需要手动创建路径文件夹比如js、css等，下面的write不会自动创建）
						var _write = function(){
							fsHandler.write(path.join(self.opts.dest[type], newName), content, function(){
								mark--;
								if( mark == 0 ){
									self.compressedType[type] = 1;
									self.onFinished();
								}
							});
						};

						_write();
					}
				}
			}));
		};

		for( var i in this.opts.files ){
			_compress(i);
		}
	},

	//删除静态资源里的文件，static/page（里面存放的是打包处理后的libs里的文件）里的css、js、img
	delOldFile: function(callback){
		var self = this;
		if( !this.opts.del_old_file ){
			callback();
			return false;
		}
		var del_path = (function(){
			var _path = [];
			for( var i in self.opts.del_old_file ){
				//这里只需匹配到前缀名称相同就行，所以使用*.匹配到某个页面下的widget的所有文件
				_path.push( self.opts.del_old_file[i] + '*.' + i );
			}
			return _path;
		})();
		//这里删除为异步（这里重复执行删除statics里的文件了，有待优化）
		console.log('删除statics/page里的文件');
		fsHandler.unlink(del_path, callback);
	},

	onFinished: function(){
		
		for( var i in this.opts.files ){
			//如果原输入的目录文件files没有被处理，则返回
			if(!!!this.compressedType[i]) return;
		}
		this.opts.onFinished && this.opts.onFinished(this.compressDetail);
	}
};

module.exports = Processor;
