var crypto = require('crypto');

var md5 = function(str){
	//将内容hash加密成固定长度的字符串
	var _str = crypto.createHash('md5').update(str, 'utf8').digest('hex');
	return _str;
};

module.exports = md5;
