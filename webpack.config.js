const webpack = require('webpack');
const path = require('path');

module.exports = {
	entry: './src/index.ts',
	output: {
		path: path.resolve(__dirname, 'dist/umd'),
		filename: 'agnost.js',
		library: {
			type: 'umd',
			name: 'agnost',
		},
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				loader: 'ts-loader',
				options: {
					transpileOnly: true,
				},
			},
			{
				test: /\.js$/,
				loader: 'webpack-remove-debug',
			},
		],
	},
	resolve: {
		extensions: ['.ts', '.js', '.json'],
	},
	plugins: [
		new webpack.DefinePlugin({
			process: 'process/browser',
		}),
	],
	mode: 'production',
};
