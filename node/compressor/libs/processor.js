var gulp = require('gulp');
var path = require('path');
var uglify = require('gulp-uglify');

var cssmin = require('gulp-minify-css');

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
		this.compressDetail = [];
		this.compressedType = {};

		var _compress = function(type){
			var ext = '.' + type;
			var files = self.opts.files[type];
			var stream = gulp.src(files);

			if( type == 'css' ){
				//对于pages里的less等文件需要编译
				if( self.opts.is_compile ){
				}
			} else if( type == 'js' ){
			}
			
			//进行压缩
			if( self.opts.is_min ){
				if( type == 'js' ){
					stream = stream.pipe(uglify());
				} else if( type == 'css' ){
					stream = stream.pipe(cssmin());
				}
			}

			stream.pipe(gulpFile(function(files){
				var len = files.length;
				var mark = len;

				if( len == 0 ){
					self.compressType[type] = 1;
					self.onFinished();
					return;
				}
				for( var i=0; i<len; i++ ){
					var file = files[i];
					//获取文件内容
					var content = String(file.contents);
					var newName;
					
					//处理文件内容，比如CSS3的兼容转换
					if( self.opts.recontent ){
						var _content = self.opts.recontent(file.path, content);
						if( _content ) content = _content;
					}
					
					//根据文件内容获得hash文件名
					newName = self.opts.rename(file.path, content) + ext;

					if( self.opts.dest ){
						self.compressDetail.push([file.path, newName]);

						if( type == 'png' || type == 'jpg' || type == 'gif' ){
							//图片文件需要写入原有格式
							content = file.contents;
						}
						
						//在static/page里创建由libs处理完的文件
						var _write = function(){
							fsHandler.write(path.join(self.opts.dest[type], newName), content, function(){
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
		var delPath = (function(){
			var _path = [];
			for( var i in self.opts.del_old_file ){
				_path.push( self.opts.del_old_file[i] + '*.' + i );
			}
			return _path;
		})();
		//这里删除为异步
		fsHandler.unlink(delPath, callback);
	},

	onFinished: function(){
		for( var i in this.opts.files ){
		}
	}
};

module.exports = Processor;
