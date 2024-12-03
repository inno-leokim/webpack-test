const { merge } = require('webpack-merge');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const common = require('./webpack.common');

const config = {
    plugins: [
        /**
         * OptimizeCssAssetsPlugin을 사용하기 위해 아래 패키지 설치
         * npm i -D cssnano
         * npm i -D optimize-css-assets-webpack-plugin --legacy-peer-deps
         */
        new OptimizeCssAssetsPlugin({ 
            // assetNameRegExp: /\.optimize\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorPluginOptions: {
                preset: ['default', { discardComments: { removeAll: true } }],
            },
            canPrint: true
        }),
    ],
    optimization: { // bundle.js 파일 최적화 옵션
        runtimeChunk: {
            name: 'runtime'
        },
        splitChunks: { // 공통으로 묶는 모듈들이 node_modules 폴더 안에 있는 파일들이라고 정의
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/, //여기서는 jquery의 내용이 담긴다.
                    name: 'venders', //벤더 파일 이름은 venders
                    chunks: 'all'
                }
            }
        },
        minimize: true,   
        //JS파일 압축 compressoer를 terser를 사용한다. terser-webpack-plugin을 설치해야 사용할 수 있다. js파일을 minify 한다.
        //다른 플러그인도 있다.
        minimizer: [new TerserWebpackPlugin({
            terserOptions: {
                nameCache: null,
                mangle: true
            }
        })] 
    },
    // mode 키를 통해 개발환경을 정의할 수 있다. development, production
    mode: 'production'
}

module.exports = merge(common, config);