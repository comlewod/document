/* 
 * 处理tpl项目下所有widget的php、js、css、图片
 */

var gulp = require('gulp');
var path = require('path');

var dir = require('./dir');
var config = require('./config');
var md5 = require('./md5');

var resolvePath = require('./resolvePath');
var processor = require('./processor');
var compileTpl = require('./compileTpl');

var Images = function(opts){
	var self = this;
	this.info = resolvePath(opts.filepath);//opts.filepath为页面文件的地址，ex: pages/koala/post/index.php
	this.widgets = opts.widgets;//该页面所有widgets
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
			_files.jpg.push(path.join(dir.pages, self.info.tpl.dir, self.info.tpl.name, i, '*.jpg'));
			_files.png.push(path.join(dir.pages, self.info.tpl.dir, self.info.tpl.name, i, '*.png'));
			_files.gif.push(path.join(dir.pages, self.info.tpl.dir, self.info.tpl.name, i, '*.gif'));
		}

		//打包前删除上次打包的相应图片，这里i是widget名称，和下面的rename函数的name前缀名称相同
		for( var i in this.widgets ){
			_delFiles.jpg.push(path.join(dir.static_page, 'img', 'img_' + md5(this.info.prefix + i).slice(0, 5)));
			_delFiles.png.push(path.join(dir.static_page, 'img', 'img_' + md5(this.info.prefix + i).slice(0, 5)));
			_delFiles.gif.push(path.join(dir.static_page, 'img', 'img_' + md5(this.info.prefix + i).slice(0, 5)));
		}
		
		if( _files.jpg.length == 0 ){
			this.callback();
			return;
		}
		
		//对widget的图片进行处理
		var process = new processor({
			files: _files,
			rename: function(filepath, content){
				var info = resolvePath(filepath);
				//命名规则要和上面的删除路径前缀相对应
				return 'img_' + md5(self.info.prefix + info.widgetname).slice(0, 5) + md5(content).slice(0, 3) + '_' + info.filename;
			},
			onFinished: function(data){
				self.data = data;
				//开始打包windget的php、less、js文件
				self.replacePath();
			},
			dest: {
				jpg: path.join(dir.static_page,  'img'),
				png: path.join(dir.static_page,  'img'),
				gif: path.join(dir.static_page,  'img')
			},
			
			/*recontent: function(filepath, content){
				var info = resolvePath(filepath);
				self.replaceContent(info, content);
			},*/
			del_old_file: _delFiles,
		});
		process.start();
	},
	
	//图片处理完后，对widget里的php、js、css（less）进行集合整理，放在output/widgets
	replacePath: function(){
		var self = this;
		
		var _files = {php: [], js: [], css: []};
		var _del_files = {php: [], js: [], css: []};
		var front_name = '';

		for( var i in this.widgets ){
			front_name = path.join(dir.pages, self.info.tpl.dir, self.info.tpl.name, i);
			_files.php.push( path.join(front_name, '*.php') );
			_files.js.push( path.join(front_name, '*.js') );
			_files.css.push( path.join(front_name, i, '*.css') );
			_files.css.push( path.join(front_name, '*.less') );
		}

		for( var i in this.widgets ){
			front_name = path.join(dir.output_widget, self.info.tpl.dir + '_' + self.info.tpl.name + '_' + i);
			_del_files.php.push( front_name );
			_del_files.js.push( front_name );
			_del_files.css.push( front_name );
		}

		var process = new processor({
			files: _files,
			dest: {
				php: dir.output_widget,
				js: dir.output_widget,
				css: dir.output_widget
			},
			rename: function(filepath, content){
				var info = resolvePath(filepath);
				var name;
				if( info.ext = 'php' && info.filename[0] == '_' ){
					name = info.tpl.dir + '_' + info.tpl.name + '_' + info.widgetname + info.filename;
				} else {
					name = info.tpl.dir + '_' + info.tpl.name + '_' + info.widgetname;
				}
				return name;
			},
			recontent: function(filepath, content){
				var info = resolvePath(filepath);
				return self.replaceContent(info, content);
			},
			onFinished: function(){
				console.log('| 完成：打包至output');
				self.callback && self.callback();
			},
			delOldFile: _del_files,
		});
		process.start();
	},

	//匹配文件里的图片路径换成打包后的路径
	replaceContent: function(info, content){
		var data = this.data;
		var len = data.length;

		for( var i=0; i<len; i++ ){
			//原图片文件信息
			var _info = resolvePath(data[i][0]);
			//图片文件的hash名称
			var _replaceName = data[i][1];
			var _reg;
			
			//判断文本文件（php、js等）和图片的所属widget是否为同一个
			if( info.prefix == _info.prefix ){
				//文本里图片地址的字符串，比如url(heander_img.gif)里的header_img.gif
				var name = _info.filename + '.' + _info.ext;

				//静态资源内容通过比如static.zealer.com域名来访问，在nginx上配置访问文件
				_reg = new RegExp(name, 'g');
				//content = content.replace(_reg, path.join(config.STATIC_IMG, _replaceName));

				if( info.ext == 'php' ){
					content = content.replace(_reg, "{yiiApp 'STATIC_HOST'}page/img/" + _replaceName);
				} else if( info.ext == 'js' ){
					//ex: src = str_1 + "test.png" + str_2
					_reg = new RegExp('"' + name + '"', 'g');
					content = content.replace(_reg, 'window.STATIC_HOST+"page/img/' + _replaceName + '"');

					//ex: src = str + 'test.png' + str_2
					_reg = new RegExp('\'' + name + '\'', 'g');
					content = content.replace(_reg, 'window.STATIC_HOST+\'page/img/' + _replaceName + '\'');

					//ex: 'url(test.png)'
					_reg = new RegExp('\'url\\(' + name + '\\)\'', 'g');
					content = content.replace(_reg, '\'url(\'+window.STATIC_HOST+\'' + _replaceName + ')\'');

					//ex: "url(test.png)"
					_reg = new RegExp('"url\\(' + name + '\\)"', 'g');
					content = content.replace(_reg, '"url("+window.STATIC_HOST+"page/img/' + _replaceName + ')"');
				} else if( info.ext == 'css' || info.ext == 'less' ){
					_reg = new RegExp('url\\(' + name + '\\)', 'g');
					content = content.replace(_reg, 'url(/page/img/' + _replaceName + ')');
				}
			}
		}
		if( info.ext == 'php' ){
			content = compileTpl(content);
		}
		return content;
	}
};

module.exports = Images;
