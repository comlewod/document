var webpack = require('webpack');
var path = require('path');

module.exports = {
	entry: './main.jsx',
	output: {
		path: './output',
		publicPath: '/output',
		filename: 'bundle.js'
	},
	module: {
		loaders: [
			{ test: /\.jsx/, loader: 'jsx-loader' }
		]
	},
	watch: true
};
