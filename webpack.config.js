const path = require('path');

module.exports = {
	entry: './src/timers.js',
	output: {
	  filename: '[name].bundle.js',
	  path: path.resolve(__dirname, 'dist')
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ['@babel/preset-env']
					}
				}
			},
			{
				test: /\.css$/,
				loader: 'style-loader!css-loader',
				include: /flexboxgrid/
			}
		]
	}
};