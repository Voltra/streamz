const path = require("path");

const FriendlyErrorsPlugin = require("@nuxt/friendly-errors-webpack-plugin");
const ColoredProgressBar = require("colored-progress-bar-webpack-plugin");


const here = (uri = "") => path.resolve(__dirname, uri);

module.exports = {
	mode: "production",
	stats: "minimal", // For compatibility w/ friendly-errors-webpack-plugin
	target: "web",
	entry: here("./esm/index.js"),
	devtool: false,
	output: {
		filename: "index.js",
		path: here("dist"),
		library: {
			name: "streamz",
			type: "umd",
		},
		globalObject: "this",
		pathinfo: false,
		environment: {
			arrowFunction: false,
		},
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
				},
			},
		],
	},
	plugins: [
		new ColoredProgressBar({
			showDetail: false,
			showMessage: false,
			notification: false,
		}),
		new FriendlyErrorsPlugin({}), //cf. https://github.com/geowarin/friendly-errors-webpack-plugin/issues/123
	],
	optimization: {
		minimize: true,
		usedExports: true,
	},
};