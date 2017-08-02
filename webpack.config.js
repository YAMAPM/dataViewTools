const path = require("path");
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const CleanWebpackPlugin = require('clean-webpack-plugin');
module.exports = {

    entry: {
        app: './app/index.js'
    },
    output: {
        path: path.resolve(__dirname, "public"),
        // publicPath: "/assets/",
        filename: "bundle.js"
    },
    devtool: 'inline-source-map',
    module: {
    	loaders: [
            {
                test: /\.js|jsx$/, //是一个正则，代表js或者jsx后缀的文件要使用下面的loader
                loader: "babel-loader",
                exclude: /node_modules/,
                query: {
                    presets: ['es2015','stage-2']
                }
            },
            { 
                test: /\.jade$/, loader: "jade-loader" 
            },
            {
                test: /\.pug$/,
                loader: 'pug'
            },
            {   test: /\.css$/, 
                loader: 'style-loader!css-loader' 
            },
            { test: /\.(woff|ttf|eot|svg)(\?v=[a-z0-9]\.[a-z0-9]\.[a-z0-9])?$/, 
                loader: 'url-loader?limit=100000' 
            }
        ]
   },
   devServer: {
   		contentBase: path.join(__dirname, "public"),

	    inline: true//实时刷新
	},
    /*plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.jade',
            filename: '/index.html'
        })
    ]*/
};