
var gulp = require('gulp');
var path = require('path');

var resolvePath = require('./resolvePath');
var processor = require('./processor');
var widgetMap = require('./widgetMap');

var dir = require('./dir');
var md5 = require('./md5');
var config = require('./config');

var Widget = function(src){
	var self = this;

	this.src = src;
	
	//得到该页面下的widget
	console.log(src);
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

				//分析改页面所需要的widget
				widgets = self.processMap(widgets);
			},
		});
		process.start();
	},

	processMap: function(widgets){
		var self = this;
		var _widgets = {};

		var getWidget = function(name){
			var _map = self._widgetMap[name] || [];
		};
	}
};

module.exports = Widget;
