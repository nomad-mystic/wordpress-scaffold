const path = require('path');
const fs = require('fs');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackNotifier = require('webpack-notifier');
const TerserPlugin = require('terser-webpack-plugin');
const globImporter = require('node-sass-glob-importer');
const { VueLoaderPlugin } = require('vue-loader');

const babelConfig = require('./babel.config.json');


WEBPACK_PATH

module.exports = () => {
    let config = {
        mode: process.env.NODE_ENV,
        entry: {
            main: [
                path.resolve(__dirname, `${finalPath}/src/js/main.js`),
                path.resolve(__dirname, `${finalPath}/src/scss/main.scss`),
            ],
            admin: [
                path.resolve(__dirname, `${finalPath}/src/js/admin.js`),
                path.resolve(__dirname, `${finalPath}/src/scss/admin.scss`),
            ],
        },
        optimization: {
            minimize: process.env.NODE_ENV === 'production',
            minimizer: [
                new TerserPlugin({
                    test: /\.js(\?.*)?$/i,
                }),
            ],
        },
        output: {
            path: path.resolve(__dirname, `${finalPath}/`),
            publicPath: `${finalPath}/`,
            filename: 'js/[name].js',
        },
        module: {
            rules: [
                {
                    test: /\.s[ac]ss$/i,
                    exclude: /(node_modules)/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[name].css',
                                outputPath: 'css',
                                esModule: false,
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: process.env.NODE_ENV !== 'production',
                                postcssOptions: {
                                    config: 'postcss.config.js',
                                },
                            },
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: process.env.NODE_ENV !== 'production',
                                // Prefer `dart-sass`
                                implementation: require('sass'),
                                sassOptions: {
                                    importer: globImporter(),
                                    precision: 10,
                                },
                            },
                        },
                    ],
                },
                {
                    test: /\.vue$/,
                    loader: 'vue-loader'
                },
                {
                    test: /\.js$/,
                    exclude: /(node_modules)/,
                    loader: 'babel-loader',
                    options: {
                        presets: babelConfig.presets,
                        plugins: babelConfig.plugins,
                    },
                },
            ],
        },
        plugins: [
            new MiniCssExtractPlugin({
                // Options similar to the same options in webpackOptions.output
                // all options are optional
                filename: `${finalPath}/css/[name].css`,
                chunkFilename: '[id].css',
                ignoreOrder: false, // Enable to remove warnings about conflicting order
            }),
            new VueLoaderPlugin(),
            new WebpackNotifier({
                title: 'PROJECT_NAME Build',
                contentImage: path.join(__dirname, 'webpack-build-icon.png'),
                alwaysNotify: true,
                skipFirstNotification: false,
                excludeWarnings: false,
            })
        ],
    };

    // Development overwrites
    if (process.env.NODE_ENV === 'development') {
        config.devtool = 'source-map';
    }

    return config;
};
