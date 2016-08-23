/* 处理项目下的global文件的静态资源 */

var path = require('path');
var dir = require('./dir');
var md5 = require('./md5');
var processor = require('./processor');
var processImage = require('./processImage');
var widgetMap = require('./widgetMap');
var compileCss = require('./compileCss');
var compileTpl = require('./compileTpl');
var tasks = require('./tasks');

var tpl_dirs = {};
var Global = function(is_min, lib_dest, tplDir){
	console.log(tpl_dirs);
	//记录打包过的项目
	if( tplDir ){
		tpl_dirs[tplDir] = 1;
	} else {
		//当static/libs文件修改过时，将tpl_dirs打包过的项目重新打包，更新layouts中libs的文件名
		for( var i in tpl_dirs ){
			new Global(is_min, lib_dest, i);
		}
		return;
	}
	//lib_dest为这个项目前面lib里打包好的文件目录
	console.log('****** 2、' + tplDir + '___打包global');

	var src = path.join(dir.pages, tplDir, 'global', 'test.php');//这里填写test.php是用来获取该项目的widget位置，无需有该文件，作用相当于/post/index.php，用于resolvePath分析
	var _widgets;
	var _dest = {
		libs: lib_dest,
		global: {js: '', css: ''}
	};
	
	//获取项目子页面里的说有widget，并将widget里的文本文件都打包到output文件里，图片打包到static/page/img里
	//这一步并没有对css、js文件进行编译
	widgetMap(src, function(map){
		//map得到一个子页面文件目录下的的所有widget(文件)名称的对象集合，比如{header:[], commmon:[]}
		_widgets = processWidget(map);
		new processImage({
			widgets: _widgets,
			filepath: src,
			callback: function(){
				process.start();
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
	
	//将output里的css、js再处理，进行编译、合并、压缩等
	var pre_name = md5(tplDir).slice(0, 5);
	var process = new processor({
		files: {
			js: path.join(dir.output_widget, tplDir + '_global_*.js'),
			css: path.join(dir.output_widget, tplDir + '_global_*.css'),
		},
		rename: function(filepath, content){
			return 'global_' + pre_name + md5(content).slice(0, 5);
		},
		recontent: function(filepath, content){
			if( filepath.indexOf('.css') > -1 ){
				content = compileCss(content);
			}
			return content;
		},
		onFinished: function(data){
			for( var i=0; i<data.length; i++ ){
				if( data[i][1].indexOf('.js') > -1 ){
					_dest.global.js = data[i][1];
				} else if( data[i][1].indexOf('.css') > -1 ){
					_dest.global.css = data[i][1];
				}
			}
			replacePath();
		},
		dest: {
			js: path.join(dir.static_page, 'js'),
			css: path.join(dir.static_page, 'css')
		},
		del_old_file: {
			js: path.join(dir.static_page, 'js', 'global_' + pre_name),
			css: path.join(dir.static_page, 'css', 'global_' + pre_name),
		},
		is_min: true,
		is_concat: true,
		is_compile: true
	});
	
	//打包layouts文件
	var replacePath = function(){
		var process = new processor({
			files: {
				php: path.join(dir.pages, 'layouts', tplDir + '.php'),
			},
			dest: {
				php: dir.output_pages,
			},
			rename: function(filepath, content){
				return 'layouts_' + tplDir;
			},
			recontent: function(filepath, content){
				var content = compileTpl(content);
				content = content.replace('libs.js', _dest.libs.js);
				content = content.replace('libs.css', _dest.libs.css);
				content = content.replace('global.js', _dest.global.js);
				content = content.replace('global.css', _dest.global.css);
				return content;
			},
			onFinished: function(){
				console.log('| 完成：layout');
				tasks('all').end();
			}
		});
		process.start();
	};
};

module.exports = Global;
