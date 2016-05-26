// 将比如pages/layouts/koala.php等字符的路径信息拆解，并用对象保存每个路径点信息

module.exports = function(src){
	//var _arrPath = src.split('\\').reverse(); //win是反斜杠
	var _arrPath = src.split('/').reverse();

	//页面如index里的组件如banner信息
	var info = {
		widgetname: _arrPath[1], //组件名称，banner
		ext: _arrPath[0].split('.').pop(),
		//filename: _arrPath[0].slice(0, _arrPath[0].lastIndexOf('.'))
		filename: _arrPath[0].split('.')[0], //项目名称
		tpl: {
			name: _arrPath[2], //页面名称，如index
			dir: _arrPath[3] //项目名称, 如koala
		},
		type: 'widget'
	};

	//页面（比如post）组件信息
	if( _arrPath[4] != 'pages' ){
		info.tpl.name = _arrPath[1]; //项目第一子级组件名称，即页面名称，如post、index
		info.tpl.dir = _arrPath[2]; //项目名称
		info.widgetname = '';
		if( _arrPath[3] == 'pages' ){
			info.type = 'page';
		}
	}

	//组成准本生成的文件名
	//info.prefix = info.tol.dir + '_' + info.tpl.name + '_' + info.widgetname;
	return info;
};
