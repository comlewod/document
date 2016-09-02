/* 
 * 全局地址
 */

var path = require('path');

var config = {};

//config.STATIC_HOST = 'http://static.koala.com';
//config.STATIC_IMG = path.join(config.STATIC_HOST, 'page', 'img');

config.widget_reg = /{widget (.*?)}/gi;
config.widget_name_reg = /\(|"|'|\)/g;

module.exports = config;
