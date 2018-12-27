// nodejs �е�pathģ��
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    // ����ļ���path.resolve()���������Խ�����Ǹ�������������������ɾ���·��������ָ��ľ������ǵ�index.js�ļ�
	entry: {
			index: [
				path.resolve(__dirname, '../src/main.js')
			]
		},
    // �������
    output: {
        // ���·���� myProject/output/static
        path: path.resolve(__dirname, '../output/static'),
        publicPath: '/',
        filename: '[name].[hash].js',
        chunkFilename: '[id].[chunkhash].js'
    },
    resolve: {
        extensions: [' ', '.js', '.vue'],
        alias: {
            'vue': 'vue/dist/vue.js'
        }
    },
    module: {

        loaders: [
            // ʹ��vue-loader ���� .vue ��β���ļ�
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'url-loader',
            },
            {
                test: /\.(eot|woff|woff2|svg|ttf)([\?]?.*)$/,
                loader: 'file-loader',
            },
            {
                test: /\.js$/,
                loader: 'babel-loader?presets=es2015',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                //loader: 'vue-style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
				//loader: 'vue-style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
                //loader: 'vue-loader'
                loader: 'style-loader!css-loader'
            }
        ]
    },/*
    Favlist: {
        loaders: {
            js: 'babel'
        }
    },*/
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(__dirname, '../index.html'),
            inject: true
        })
    ]
}