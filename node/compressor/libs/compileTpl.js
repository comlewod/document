/*
 * 文件内容替换
 */

var reg = [
	//echo
	[/{_(.*?)}/gi, '<?php echo $1; ?>'],
	[/{\$(.*?)}/gi, '<?php echo $$$1; ?>'],

	//widget方法
	[/{widget (.*?)}/gi, '<?php $this->loadWidget($1); ?>'],
	[/{setLayout (.*)?}/gi, '<?php $this->setLayout($1); ?>'],
	[/{yiiApp (.*)?}/gi, '<?php $this->yiiApp($1); ?>'],

	//自定义方法
	[/<!--{startBlock (.*?)}-->/gi, '<?php $this->startBlock($1); ?>'],
	[/<!--{endBlock}-->/gi, '<?php $this->endBlock(); ?>'],
];

module.exports = function(content){
	var len = reg.length;
	for( var i=0; i<len; i++ ){
		content = content.replace(reg[i][0], reg[i][1]);
	}

	return content;
};
