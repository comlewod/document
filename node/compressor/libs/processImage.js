/* 
 * 处理tpl项目下所有widget的图片 
 */

var gulp = require('gulp');
var path = require('path');

var dir = require('./dir');
var md5 = require('./md5');

var resolvePath = require('./resolvePath');
var processor = require('./processor');

var Images = function(opts){
	var self = this;
	this.info = resolvePath(opts.filepath);
	this.widgets = opts.widgets;
	this.callback = opts.callback;
	this.is_min = opts.is_min;
	this.compileImg();
};

Images.prototype = {
	compileImg: function(){
		var self = this;
		//根据widget路径通过MD5生成文件名
		var prefix = 'img_' + md5(this.info.prefix).slice(0, 5);

		var _files = {jpg: [], png: [], gif: []};
		var _delFiles = {jpg: [], png: [], gif: []};

		//获取widget目录下的所有图片
		for( var i in this.widgets ){
			_files.jpg.push(path.join(dir.widget, self.info.tpl.dir, self.info.tpl.name, i, '*.jpg'));
			_files.jpg.push(path.join(dir.widget, self.info.tpl.dir, self.info.tpl.name, i, '*.png'));
			_files.jpg.push(path.join(dir.widget, self.info.tpl.dir, self.info.tpl.name, i, '*.gif'));
		}

		//打包前删除上次打包的相应图片，这里i是widget名称，和下面的rename函数的name前缀名称相同
		for( var i in this.widgets ){
			_delFiles.jpg.push(path.join(dir.page, 'img', 'img_' + md5(this.info.prefix + i).slice(0, 5)));
			_delFiles.png.push(path.join(dir.page, 'img', 'img_' + md5(this.info.prefix + i).slice(0, 5)));
			_delFiles.gif.push(path.join(dir.page, 'img', 'img_' + md5(this.info.prefix + i).slice(0, 5)));
		}
		
		if( _files.jpg.length == 0 ){
			this.callback();
			return;
		}

		var process = new processor({
			files: _files,
			rename: function(filepath, content){
				var info = resolvePath(filepath);
			},
			onFinished: function(data){
				self.data = data;
				//开始打包windget的php、less、js文件
				self.replacePath();
			},
			dest: {
				jpg: path.join(dir.page,  'img'),
				png: path.join(dir.page,  'img'),
				gif: path.join(dir.page,  'img')
			},
			rename: function(filepath, content){
				var info = resolvePath(filepath);
				//命名规则要和上面的删除路径前缀相对应
				return 'img_' + md5(self.info.prefix + info.widgetname).slice(0, 5) + md5(content).slice(0, 3) + '_' + info.filename;
			},
			recontent: function(filepath, content){
				var info = resolvePath(filepath);
				self.replaceContent(info, content);
			},
			del_old_file: _delFiles,
		});
		process.start();
	},

	replacePath: function(){
		var self = this;
		
		var _files = {php: [], js: [], css: []};
		var _del_files = {php: [], js: [], css: []};

		for( var i in this.widgets ){
			_files.php.push(path.join(dir.widget, self.info.tpl.dir, self.info.tpl.name, i, '*.php'));
		}

		for( var i in this.widgets ){
			_del_files.php.push(path.join(dir.output_widget, self.info.tpl.dir + '_' + self.info.tpl.name + '_' + i));
		}
	},

	//匹配文件里的图片路径换成打包后的路径
	replaceContent: function(info, content){
		var data = this.data;
		/*var len = data.length;

		for( var i=0; i<len; i++ ){
			var _info = resolvePath(data[i][0]);
			var _replaceName = data[i][1];
			var _reg;

			if( info.prefix == _info.prefix ){
			}
		}*/
	}
};

module.exports = Images;
