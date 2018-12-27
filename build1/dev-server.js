// �����Ҫ��ģ��
var express = require('express')
var webpack = require('webpack')
var config = require('./webpack.dev.conf')

// ����һ��expressʵ��
var app = express()

// ����webpack�������ô��ݹ�ȥ
var compiler = webpack(config)

// ʹ�� webpack-dev-middleware �м��
var devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: config.output.publicPath,
    stats: {
        colors: true,
        chunks: false
    }
})

var hotMiddleware = require('webpack-hot-middleware')(compiler)

// webpack���������html�ļ��ı��¼�
compiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
        // �����¼�
        hotMiddleware.publish({ action: 'reload' })
        cb()
    })
})


app.use(devMiddleware)
app.use(hotMiddleware)

// ���� 8080
app.listen(8080, function (err) {
    if (err) {
        console.log(err)
        return
    }
    console.log('Listening at http://localhost:8080')
})