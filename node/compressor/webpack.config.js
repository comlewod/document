var webpack = require('webpack');
var path = require('path');

module.exports = {
	entry: './../../pages/tests/main.js',
	//entry: path.resolve(__dirname, './main.js'),
	//entry: './main.js',
	output: {
		path: './../../output',
		filename: 'final.js'
	},
	module: {
		loaders: [
			{ 
				test: /\.css$/, 
				loader: "style-loader!css-loader",
			}
		]
	},
	resolve: {
		root: [
			path.resolve('/')
		],
		//moduleDirectories: [path.resolve(__dirname)],
		extensions: ['', '.js', '.css']
	},
};
