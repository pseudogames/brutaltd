var path = require('path');
var webpack = require('webpack');

module.exports = {
	entry: [
		'babel-polyfill',
		'./app/js/main'
	],
	output: {

		path: path.join(__dirname, 'build/js'),
		filename: 'bundle.js'
	},
	devServer: {
		contentBase: "./build"
	},
	devtool: 'source-map',
	module: {
		loaders: [
			{
				test: /\.js$/,
				include: path.join(__dirname, 'app/js'),
				loader: 'babel-loader',
				query: {
					plugins: [
						"transform-runtime",
						"transform-es2015-classes",
						"typecheck",
						"syntax-flow",
						"transform-flow-strip-types"
					],
					presets: ["es2015"],
				}
			}
		]
	},
	debug: true
};
