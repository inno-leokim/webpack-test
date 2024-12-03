/**
 * webpack.common.js 파일에는 공통으로 적용되는 내용만 작성한다.
 */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');

const isProduction = process.env.NODE_ENV === 'PRODUCTION';

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
            minify: isProduction ? { // html을 한 줄로 만들어준다. 
                collapseWhitespace: true,
                useShortDoctype: true,
                removeScriptTypeAttributes: true
            } : false
        }),
        // new MiniCssExtractPlugin({filename: '[name].css'}),
        new CleanWebpackPlugin(),
        new webpack.DefinePlugin({
            IS_PRODUCTION: isProduction
        }), 
    ],
}