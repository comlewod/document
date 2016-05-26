var gulp = require('gulp');
var uglify = require('gulp-uglify');

var cssmin = require('gulp-minify-css');

var gulpFile = require('./gulp-files');
var fsHandler = require('./fsHandler');

var Processor = function(opts){
	this.opts = {
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
				}
				for( var i=0; i<len; i++ ){
					var file = files[i];
					var content = String(file.contents);
					console.log(content);
				}
			}));
		};

		for( var i in this.opts.files ){
			_compress(i);
		}
	},

	//删除静态资源里的文件，static里的css、js、img
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
		fsHandler.unlink(delPath, callback);
	}
};

module.exports = Processor;
