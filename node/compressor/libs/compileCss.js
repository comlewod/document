// 处理CSS3
var keys = [
	'box-shadow',
	'transform',
	'filter', 
	'animation', 
	'flex',
];
var reg_arr = [];

for( var i=0; i< keys.length; i++ ){
	var attr = keys[i];

	reg_arr.push(
		[new RegExp('-webkit-' + attr + ':', 'gi'), attr + ':']
	);
	reg_arr.push(
		[new RegExp('-ms-' + attr + ':', 'gi'), attr + ':']
	);
	reg_arr.push(
		[new RegExp('-moz-' + attr + ':', 'gi'), attr + ':']
	);
	//通过 ？懒惰模式匹配，将上面匹配到并生成的属性都写成一个属性，如将-webkit-transition、-moz-transition等多个转成一个transition
	reg_arr.push(
		[new RegExp(attr + ':(.*?)}', 'gi'), attr + ':$1;}']
	);
	reg_arr.push(
		[new RegExp(attr + ':(.*?);', 'gi'), attr + ':$1;-webkit-' + attr + ':$1;-ms-' + attr + ':$1;-moz-' + attr + ':$1;']
	);
}

module.exports = function(content){
	var reg = reg_arr;
	for( var i=0, l=reg.length; i<l; i++ ){
		//全局匹配文件内容
		content = content.replace(reg[i][0], reg[i][1]);
	}
};
