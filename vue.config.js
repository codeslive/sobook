
/*
    安装:uglifyjs-webpack-plugin插件,用于去掉console.log语句
    安装命令:
    npm install uglifyjs-webpack-plugin
*/

//引入去除uglifyjs-webpack-plugin的模块
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');


module.exports = {

    //打包引入文件路径为dist根目录
    publicPath: './',
    //关闭生产环境下的map,减少包的体积
    productionSourceMap: false,

    configureWebpack: config => {
        return {
            plugins: [
                //打包环境去掉console.log
                new UglifyJsPlugin({
                    uglifyOptions: {
                        compress: {
                            drop_console: true,  //注释console
                            drop_debugger: true, //注释debugger
                            pure_funcs: ['console.log'], //移除console.log
                        }
                    },
                }),
            ],
            //打包时自动忽略本地vue.js和ElementUI的包,然后在index.html引入外部cdn,可以减少一部分包的体积
            //ElementUI+vue要同时忽略,忽略完后在indedx.html引入,否则会导致ElementUI不可用或报错
        
            // externals: {
            //     'vue': 'Vue',
            //     'element-ui': 'ElementUI',
            // },

            //解决资源打包提示文件体积过大导致的警告
            performance: {
                maxEntrypointSize: 10000000,
                maxAssetSize: 30000000
            },

            // 公共代码抽离
            optimization: {
                splitChunks: {
                    cacheGroups: {
                        vendor: {
                            chunks: 'all',
                            test: /node_modules/,
                            name: 'vendor',
                            minChunks: 1,
                            maxInitialRequests: 5,
                            minSize: 0,
                            priority: 100
                        },
                        common: {
                            chunks: 'all',
                            test: /[\\/]src[\\/]js[\\/]/,
                            name: 'common',
                            minChunks: 2,
                            maxInitialRequests: 5,
                            minSize: 0,
                            priority: 60
                        },
                        styles: {
                            name: 'styles',
                            test: /\.(sa|sc|c)ss$/,
                            chunks: 'all',
                            enforce: true
                        },
                        runtimeChunk: {
                            name: 'manifest'
                        }
                    }
                }
            }

        };
    },

}