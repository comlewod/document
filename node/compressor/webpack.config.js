module.exports = {
	entry: './../../pages/tests/main.js',
	output: {
		path: './../../output',
		filename: 'final.js'
	},
	module: {
		test: /\.css$/,
		loader: 'style!css'
	}
};
