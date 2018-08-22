const path = require('path');
const webpack = require('webpack');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const merge = require('webpack-merge');

module.exports = (env) => {
    const isDevBuild = !(env && env.prod);
	const extractCSS = new MiniCssExtractPlugin('site.css');

    const outputDir = (env && env.publishDir)
        ? env.publishDir
        : __dirname;

    const commonConfig = {
        mode: isDevBuild ? 'development' : 'production',
        resolve: {
            extensions: ['.js', '.jsx', '.ts', '.tsx', '.scss']
        },
        stats: {
            modules: false
        },
        watchOptions: {
            ignored: ['**/*.d.ts', 'node_modules']
        },
        output: {
            filename: '[name].js',
        },
        module: {
            rules: [
                // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
                {
                    test: /\.tsx?$/,
                    include: /ClientApp/,
                    loader: [
                        {
                            loader: 'awesome-typescript-loader',
                            options: {
                                useCache: true,
                                useBabel: true,
                                babelOptions: {
                                    babelrc: false,
                                    plugins: ['react-hot-loader/babel'],
                                }
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            new webpack.NamedModulesPlugin(),
            new CheckerPlugin()
        ]
    };
	
	const serviceWorkerConfig = merge(commonConfig, {
        devtool: 'inline-source-map',
        entry: {
			'serviceWorker': './ClientApp/serviceWorker.ts'
        },
		output: {
			path: path.join(outputDir, 'wwwroot', 'dist'),
			publicPath: 'wwwroot/dist/'
		},
		plugins: isDevBuild ? [
			new webpack.SourceMapDevToolPlugin({
				filename: '[file].map', // Remove this line if you prefer inline source maps
				moduleFilenameTemplate: path.relative( 'wwwroot', 'dist',
					'[resourcePath]') // Point sourcemap entries to the original file locations on disk
			})
		] : [
			// Plugins that apply in production builds only
			new webpack.optimize.UglifyJsPlugin()
		]
	});

	const clientConfig = merge(commonConfig, {
        devtool: 'inline-source-map',
        entry: {
			'app': './ClientApp/boot-client.tsx',
        },
		module: {
			rules: [
				{
					test: /\.scss$/,
					use: [
						'css-hot-loader',
						MiniCssExtractPlugin.loader,
 						{
							loader: 'typings-for-css-modules-loader',
							options: {
								modules: true,
								namedExport: true,
								sass: true,
								sourceMap: true,
								camelCase: true,
								localIdentName: "[name]__[local]"
							}
						}
 					]
				},
				{
					test: /\.(png|jpg|jpeg|gif|svg)$/,
					use: 'url-loader?limit=25000'
				}]
		},
		output: {
			path: path.join(outputDir, 'wwwroot', 'dist'),
			publicPath: 'wwwroot/dist/'
		},
        devServer: {
            hot: true
        },
		plugins: [
			extractCSS,
			new webpack.DllReferencePlugin({
				context: outputDir,
				manifest: require('./wwwroot/dist/vendor-manifest.json')
			}),

		].concat(isDevBuild ? [
			new webpack.SourceMapDevToolPlugin({
				filename: '[file].map', // Remove this line if you prefer inline source maps
				moduleFilenameTemplate: path.relative( 'wwwroot', 'dist',
					'[resourcePath]') // Point sourcemap entries to the original file locations on disk
			})
		] : [
			// Plugins that apply in production builds only
			new webpack.optimize.UglifyJsPlugin()
		])

	});

	const serverConfig = merge(commonConfig, {
		resolve: { mainFields: ['main'] },
		entry: {
            'main-server': './ClientApp/boot-server.tsx',
        },
		module: {
			rules: [
				{
					test: /\.scss$/,
					use: [
						MiniCssExtractPlugin.loader,
						{
							loader: 'typings-for-css-modules-loader',
//							loader: 'css-loader',
							options: {
								modules: true,
								namedExport: true,
								sass: true,
								sourceMap: true,
								camelCase: true,
								localIdentName: "[name]__[local]"
							}
						}
					]
				}
			]
		},
		output: {
			libraryTarget: 'commonjs',
			path: path.join(outputDir, 'dist', 'server')
		},
		plugins: [
			extractCSS,
			new webpack.DllReferencePlugin({
				context: outputDir,
				manifest: require('./dist/server/vendor-manifest.json'),
				sourceType: 'commonjs2',
				name: './vendor'
			}),
		],
		target: 'node',
		devtool: 'inline-source-map'
	});

	return [clientConfig, serviceWorkerConfig, serverConfig];
};