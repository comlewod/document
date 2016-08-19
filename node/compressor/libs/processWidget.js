
var gulp = require('gulp');
var path = require('path');

var resolvePath = require('./resolvePath');
var processor = require('./processor');
var processImage = require('./processImage');
var widgetMap = require('./widgetMap');
var compileCss = require('./compileCss');
var compileTpl = require('./compileTpl');

var dir = require('./dir');
var md5 = require('./md5');
var config = require('./config');
var tasks = require('./tasks');

var Widget = function(src){
	var self = this;

	this.src = src;
	
	//得到该页面下的widget
	console.log('| 路径：' + src);
	widgetMap(this.src, function(map){
		self._widgetMap = map;
		self.initialize();
	});
};

Widget.prototype = {
	initialize: function(){
		var self = this;
		self.findWidget();
	},
	findWidget: function(){
		var self = this;
		var src;
		var info = resolvePath(this.src);

		if( info.type == 'page' ){
			src = this.src;
		} else {
			src = path.join(dir.pages, info.tpl.dir, info.tpl.name, '*.php');
		}

		//通过processor获取文本内容，从而获取该文本内容里的其它需要打包的widget
		var process = new processor({
			files: {
				php: src
			},
			rename: function(filepath){
				return null;
			},
			recontent: function(filepath, content){
				var widgets = {};
				var matches = content.match(config.widget_reg) || [];
				for( var i=0; i<matches.length; i++ ){
					var name = matches[i].replace(config.widget_reg, '$1');
					name = name.split(',')[0].replace(config.widget_name_reg, "");
					if( !!!widgets[name] ){
						widgets[name] = 1;
					}
				}

				//分析改页面所需要的widget，将所有提到的widget都列出来
				widgets = self.processMap(widgets);
				//如果当前修改的widget不包含需要打包的widget，则不进行静态打包
				/*if( info.type == 'widget' && !widgets[info.widgetname] ){
					return;
				}*/

				tasks('static').pushTask(function(){
					var log = [];
					for( var i in widgets ){
						log.push(i);
					}
					if( log.length ){
						console.log('| 打包的widgets: ' + log.join(', '));
					}
				});

				new processImage({
					widgets: widgets,
					filepath: filepath, 
					callback: function(){
						self.processStatic(filepath, widgets);
					},
					is_min: true
				});
			},
		});
		process.start();
	},
	
	processStatic: function(filepath, widgets){
		var self = this;
		var files = {js: [], css: []};
		var info = resolvePath(filepath);
		var prefix = info.prefix + info.filename + '_';

		for( var i in widgets ){
			if( i.replace(' ', '') ){
				files.js.push(path.join(dir.output_widget, info.prefix + i + '.js'));
				files.css.push(path.join(dir.output_widget, info.prefix + i + '.css'));
			}
		}

		if( !files.js.length || !files.css.length ){
			self.replacePath(filepath, files);
			return;
		}

		var process = new processor({
			files: files,
			dest: {
				js: path.join(dir.static_page, 'js'),
				css: path.join(dir.static_page, 'css'),
			},
			rename: function(filepath, content){
				return 'page_' + md5(prefix).slice(0, 5) + md5(content).slice(0, 5);
			},
			recontent: function(filepath, content){
				if( filepath.indexOf('.css') > -1 ){
					content = compileCss(content);
				}
				//content = self.toUnicode(content);
				return content;
			},
			onFinished: function(data){
				var dest = {js: '', css: ''};

				for( var i=0; i<data.length; i++ ){
					if( data[i][1].indexOf('.js') > -1 ){
						//一般合并完后只是一个文件
						dest.js = data[i][1];
					} else if( data[i][1].indexOf('.css') > -1 ){
						dest.css = data[i][1];
					}
				}

				self.replacePath(filepath, dest);
			},
			del_old_file: {
				js: path.join(dir.static_page, 'js', 'page_' + md5(prefix).slice(0, 5)),
				css: path.join(dir.static_page, 'css', 'page_' + md5(prefix).slice(0, 5)),
			},
			is_min: true,
			is_concat: true,
			is_compile: true,
		});

		process.start();
	},

	replacePath: function(filepath, dest){
		var process = new processor({
			files: {
				php: filepath
			},
			dest: {
				php: dir.output_pages
			},
			rename: function(filepath, content){
				var info = resolvePath(filepath);
				return info.tpl.dir + '_' + info.tpl.name + '_' + info.filename;
			},
			recontent: function(filepath, content){
				if( dest.js && dest.css ){
				}
				content = compileTpl(content);
				return content;
			},
			onFinished: function(){
				tasks('static').end();
				if( tasks('static').isEmpty() ){
					tasks('all').end();
				}
			}
		});
		process.start();
	},

	//将widget集合，并将widget里所需的widget提取出来都放在同一个数组里
	processMap: function(widgets){
		var self = this;
		var _widgets = {};

		var getWidget = function(name){
			var _map = self._widgetMap[name] || [];
			var l = _map.length;
			for( var i=0; i<l; i++ ){
				_widgets[_map[i]] = 1;
				getWidget(_map[i]);
			}
		};
		for( var i in widgets ){
			_widgets[i] = 1;
			getWidget(i);
		}
		return _widgets;
	}
};

module.exports = Widget;
