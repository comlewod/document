/* 
 * 全局地址
 */

var path = require('path');

var config = {};

config.STATIC_HOST = 'http://static.koala.com';
config.STATIC_IMG = path.join(config.STATIC_HOST, 'page', 'img');

module.exports = config;
