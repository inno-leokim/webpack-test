const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserWebpackPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        // filename: 'bundle.js',
        filename: '[name].[chunkhash].js', //chunk 파일 생성. hash, contenthash, chunkhash 세가지 종류의 해시 대입 가능
        path: path.resolve(__dirname, 'dist')
    },
    module: { // 각 loader의 속성을 아는 것이 중요하다!!
        rules: [
            {   
                test: /\.css$/i, // css 확장자 패턴을 가진 파일에 적용. use에는 css파일과 관련된 loader들을 추가할 수 있다.
                use: [
                    // style-loader는 처리하는 css 파일별로 style 태그를 만든다. (하나의 style 태그 안에 모든 css파일들의 내용의 담는다.)
                    {
                        loader: 'style-loader',
                        options: {
                            injectType: 'singletonStyleTag'
                        }
                    },
                    {
                        loader: 'css-loader',  //css 파일을 import 할 수 있게(모듈화) 해주는 loader
                        options: {
                            modules: {
                                namedExport: false,
                                exportLocalsConvention: 'as-is' 
                            }
                        }
                    },
                    // {
                    //     loader: MiniCssExtractPlugin.loader // css 파일을 minify 형태로 추출해 준다.
                    // }
                    // MiniCssExtractPlugin.loader
                ]
            },
            {
                test: /\.hbs$/,   //handlebars 템플릿 엔진을 사용할 수 있도록 해준다.
                use: ['handlebars-loader']
            }
        ]
    },
    plugins: [
        // 번들링과 관련된 다양한 활동을 할 수 있다.
        // output의 내용이 적용된(bundle.js 포함) index.html 파일을 dist 폴더 안에 생성해준다.
        // script 태그에 bundle.js를 포함시킬 필요가 없어진다.
        // webpack 설정 변경시 build하면 자동으로 적용되므로 신경 쓸 부분이 적어진다.
        new HtmlWebpackPlugin({
            // template: './src/template.html' 
            title: 'Webpack', //.hbs 파일 안에서 변수로 사용할 수 있다.
            template: './src/template.hbs',
            meta: { //html안에서 meta 태그로 생성된다. html 파일에 해당 meta 태그를 지워도 된다.
                viewport: 'width=device-width, initial-scale=1.0'
            },
            minify: { // html을 한 줄로 만들어준다. 
                collapseWhitespace: true,
                useShortDoctype: true,
                removeScriptTypeAttributes: true
            }
        }),
        /**
         * OptimizeCssAssetsPlugin을 사용하기 위해 아래 패키지 설치
         * npm i -D cssnano
         * npm i -D optimize-css-assets-webpack-plugin --legacy-peer-deps
         */
        new OptimizeCssAssetsPlugin({ 
            // assetNameRegExp: /\.optimize\.css$/g,
            cssProcessor: require('cssnano'), //css 압축(compressor)
            cssProcessorPluginOptions: {
                preset: ['default', { discardComments: { removeAll: true } }],
            },
            canPrint: true
        }),
        // new MiniCssExtractPlugin({filename: '[name].css'}),
        new CleanWebpackPlugin() 
    ],
    optimization: { // bundle.js 파일 최적화 옵션
        runtimeChunk: {
            name: 'runtime'
        },
        splitChunks: { // 공통으로 묶는 모듈들이 node_modules 폴더 안에 있는 파일들이라고 정의
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/, //여기서는 jquery의 내용이 담긴다.
                    name: 'vendors', //벤더 파일 이름은 venders
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
    mode: 'development'
}