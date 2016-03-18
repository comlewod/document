//var webpack = require('webpack');
var path = require('path');

module.exports = {
	entry: './main.js',
	output: {
		path: './../../output',
		filename: 'final.js'
	},
	module: {
		loaders: [
			{test: /\.css$/, loader: 'style!css'}
		]
	},
	resolve: {
		root: path.resolve(__dirname, '..'),
		extensions: ['', '.js', '.css'],
		alias: {
			asale: 'sale.js'
		}
	},
	watch: true
};
