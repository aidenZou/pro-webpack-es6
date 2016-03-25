var path = require('path')
var webpack = require('webpack')
var glob = require('glob')
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
// import fs from 'fs'

// https://github.com/MeCKodo/webpack/blob/master/webpack.config.js

var getEntry = function () {
    var entry = {};
    //首先我们先读取我们的开发目录
    // glob.sync('./source/**/*.js').forEach(function (name) {
    //   var n = name.slice(name.lastIndexOf('source/') + 7, name.length - 3);
    //   n = n.slice(0, n.lastIndexOf('/'));
    //   entry[n] = name;
    // });
    // './src/**/*.js'
    glob.sync('./src/scripts/page/*.js').forEach(function (name) {
        // console.log(name)
        var n = name.slice(19, name.length - 3);
        // console.log(n)
        // n = n.slice(0, n.lastIndexOf('/'));
        //接着我对路径字符串进行了一些裁剪成想要的路径
        entry[n] = name;
    });

    // console.log('entry:', entry);
    // { lis: './src/list.js', mai: './src/main.js' }

    //最后返回entry  给 webpack的entry
    return entry;
};

var entry = getEntry();

var debug = true;
var webpackConfig = {
  // entry: './src/main.js',
  // entry: {
  //   index: "./src/main.js",
  //   list: "./src/list.js"
  // },
  entry: entry,
  output: { //输出位置
    path: path.resolve(__dirname, 'dist'),  //配置输出路径

    // publicPath: "/assets/",
    publicPath: '../',
    // publicPath: debug ? '/__build/' : 'http://cdn.site.com/',
    // filename: '[name].build.[hash].js'
    filename: 'js/page/[name].build.[hash].js'  //文件输出形式
  },
  resolveLoader: {
    root: path.join(__dirname, 'node_modules'),
  },
  // resolve: {//一些配置项
  //   extensions: ['', '.js', '.vue','.scss'] //设置require或import的时候可以不需要带后缀
  // },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      // {
      //   test: /\.scss$/,
      //   loader: ExtractTextPlugin.extract("style-loader", 'css-loader!autoprefixer!sass-loader')
      // },
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css?minimize') // enable minimize
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style', 'css?minimize', 'sass')
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.html$/,
        loader: 'vue-html'
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url',
        // loader: 'url?limit=10000&name=./images/[name].[ext]?[hash:10]',
        query: {
          limit: 10000,
          name: './images/[name].[ext]?[hash]'
        }
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url",
        query: {
          name: '[name].[ext]?mimetype=image/svg+xml'
        }
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader?limit=10000&minetype=application/font-woff"
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url",
        query: {
          name: '[name].[ext]?mimetype=application/font-woff2'
        }
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url",
        query: {
          name: '[name].[ext]?mimetype=application/font-woff2'
        }
      }
    ]
  },
  // babel: { //配置babel
  //   "presets": ["es2015"],
  //   "plugins": ["transform-runtime"]
  // },
  devServer: {
    historyApiFallback: true,
    noInfo: true
  },
  devtool: 'eval-source-map',
  plugins: [  //编译的时候所执行的插件数组
    // new CommonsChunkPlugin("js/lib/commons.js", ["page/index", "page/list"]),
    new CommonsChunkPlugin("js/lib/commons.js", ["index", "list"]),
    // https://github.com/webpack/extract-text-webpack-plugin
    // 当allChunks指定为false时，css loader必须指定怎么处理
    new ExtractTextPlugin('css/[name].[hash].css', {
      allChunks: true
    })
  ],
  vue: { //vue的配置,需要单独出来配置
    loaders: {
      // js: 'babel'
      css: ExtractTextPlugin.extract("css"),
      // less: ExtractTextPlugin.extract("css!less-loader")
    }
  }
}

// var pages = Object.keys(getEntry('src/scripts/page/*.html', 'src/views/'));
// var pages = ['index', 'list'];
var pages = [];
for(key in entry) {
  pages.push(key);
}
console.log('pages', pages)

pages.forEach(function(pathname) {
  // console.log(pathname)
    var conf = {
        filename: 'views/' + pathname + '.html', //生成的html存放路径，相对于path
        template: './index.html', //html模板路径
        // template: './' + pathname + '.html', //html模板路径
        inject: true,    //js插入的位置，true/'head'/'body'/false
        minify: { //压缩HTML文件
            removeComments: false, //移除HTML中的注释
            collapseWhitespace: false //删除空白符与换行符
        },
        chunks: ['js/lib/commons.js', pathname],
        // hash: true
    };
    // if (pathname in webpackConfig.entry) {
    //     conf.inject = 'body';
    //     conf.chunks = ['vendors', pathname];
    //     conf.hash = true;
    // }
    // console.log('conf:', conf)
    webpackConfig.plugins.push(new HtmlWebpackPlugin(conf));
});

// console.log('webpackConfig:', webpackConfig)

module.exports = webpackConfig

// var vueLoader = {
//     js: 'babel',
//     css: ExtractTextPlugin.extract("vue-style-loader", "css-loader"),
//     sass: ExtractTextPlugin.extract("vue-style-loader", "css-loader", 'sass-loader')
// }
if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = 'source-map'
  // module.exports.vue.loaders = vueLoader
  // http://vuejs.github.io/vue-loader/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin()
  ])
}
