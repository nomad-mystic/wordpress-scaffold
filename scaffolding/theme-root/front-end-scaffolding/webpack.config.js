const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackNotifier = require('webpack-notifier');
const babelConfig = require('./babel.config.json');
const TerserPlugin = require('terser-webpack-plugin');
const themeName = 'THEME_NAME';

module.exports = () => {
    let config = {
        mode: process.env.NODE_ENV,
        entry: {
            main: [
                path.resolve(__dirname, `wp-content/themes/${themeName}/src/js/main.js`),
                path.resolve(__dirname, `wp-content/themes/${themeName}/src/scss/main.scss`),
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
            path: path.resolve(__dirname, `wp-content/themes/${themeName}/`),
            publicPath: `wp-content/themes/${themeName}/`,
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
                            },
                        },
                    ],
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
                filename: `./wp-content/themes/${themeName}/css/[name].css`,
                chunkFilename: '[id].css',
                ignoreOrder: false, // Enable to remove warnings about conflicting order
            }),
            new WebpackNotifier({
                title: 'PROJECT_NAME Build',
                contentImage: path.join(__dirname, 'webpack-build-icon.png'),
                alwaysNotify: true,
                skipFirstNotification: false,
                excludeWarnings: false,
            })
        ],
    };

    // Drupal doesn't like eval() so we have to modify for development
    if (process.env.NODE_ENV === 'development') {
        config.devtool = 'source-map';
    }

    return config;
};
