/* 处理项目下的global文件的静态资源 */

var path = require('path');
var dir = require('./dir');
var processor = require('./processor');
var processImage = require('./processImage');
var widgetMap = require('./widgetMap');

var Global = function(is_min, lib_dest, tplDir){
	console.log('****** 2、打包global：' + tplDir);

	var src = path.join(dir.template, tplDir, 'global', 'test.php');
	var _widgets;

	widgetMap(src, function(map){
		//map得到一个子页面文件目录下的的所有widget(文件)名称的对象集合，比如{header:[], commmon:[]}
		_widgets = processWidget(map);
		new processImage({
			widgets: _widgets,
			filepath: src,
			callback: function(){
			},
			is_min: true
		});
	});
	
	var processWidget = function(map){
		var _widgets = {};
		var getWidget = function(name){
			var _map = map[name] || [];
			if( _map.length == 0 ){
				return;
			}
		};

		for( var i in map ){
			_widgets[i] = 1;
			getWidget(i);
		}
		return _widgets;
	};

	var process = new processor({
	});
};

module.exports = Global;
