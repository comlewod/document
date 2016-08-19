/*
 * 文件内容替换
 */

var reg = [

	//widget方法
	[/{widget (.*?)}/gi, '<?php $this->loadWidget($1); ?>'],
	[/{setLayout (.*)?}/gi, '<?php $this->setLayout($1); ?>'],
];

module.exports = function(content){
	var len = reg.length;
	for( var i=0; i<len; i++ ){
		content = content.replace(reg[i][0], reg[i][1]);
	}

	return content;
};
