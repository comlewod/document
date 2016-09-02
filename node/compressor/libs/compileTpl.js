/*
 * 文件内容替换
 */

var reg = [
	//echo
	[/{_(.*?)}/gi, '<?php echo $1; ?>'],
	[/{=(.*?)}/gi, '<?php echo $1; ?>'],
	[/{\$(.*?)}/gi, '<?php echo $$$1; ?>'],

	//widget方法
	[/{widget (.*?)}/gi, '<?php $this->loadWidget($1); ?>'],
	[/{setLayout (.*?)}/gi, '<?php $this->setLayout($1); ?>'],
	[/{setTitle (.*?)}/gi, '<?php $this->setTitle($1); ?>'],
	[/{setKeywords(.*?)}/gi, '<?php $this->setKeywords($1); ?>'],
	[/{setDescription(.*?)}/gi, '<?php $this->setDescription($1); ?>'],
	[/{yiiApp (.*)?}/gi, '<?php $this->yiiApp($1); ?>'],
	[/{pageStatic (.*?) (.*?)}/gi, '<?php $this->pageStatic($1, $2); ?>'],

	//自定义变量
	[/<!--{startBlock (.*?)}-->/gi, '<?php $this->startBlock($1); ?>'],
	[/<!--{endBlock}-->/gi, '<?php $this->endBlock(); ?>'],
	
	//widget的script处理
	[/<!--{scriptPool}-->/gi, '<?php $this->scriptPoolStart(); ?>'],
	[/<!--{\/scriptPool}-->/gi, '<?php $this->scriptPoolEnd(); ?>'],

	//去掉注释，这个必须放在最后，去掉上面的符号
	[/<!--(.*?)-->/gi, ''],
];

module.exports = function(content){
	var len = reg.length;
	for( var i=0; i<len; i++ ){
		content = content.replace(reg[i][0], reg[i][1]);
	}

	return content;
};
