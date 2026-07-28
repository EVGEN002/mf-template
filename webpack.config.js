const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { DefinePlugin } = require('webpack');
const path = require('path');
const deps = require('./package.json').dependencies;
const Dotenv = require('dotenv-webpack');

module.exports = (env, argv) => {
  require('dotenv').config({ path: path.resolve(__dirname, '.env') });
  const isProduction = env.production;

  const plugins = [
    new HtmlWebPackPlugin({
      template: './src/index.html'
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
      chunkFilename: 'css/[id].[contenthash].css'
    }),
    new ProvidePlugin({
      React: 'react'
    }),
    ...(isProduction
      ? [
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false,
            reportFilename: 'bundle_report.html'
          })
        ]
      : []),
    new CleanWebpackPlugin(),
    new Dotenv(),
    new ModuleFederationPlugin({
      name: 'AppName',
      filename: 'remoteEntry.js',
      remotes: {},
      exposes: {
        './AppComponent': './src/app/App.tsx'
      },
      shared: {
        ...deps,
        react: {
          singleton: true,
          requiredVersion: deps.react
        },
        'react-dom': {
          singleton: true,
          requiredVersion: deps['react-dom']
        },
        axios: {
          requiredVersion: deps.axios,
          eager: false,
          singleton: true
        }
      }
    })
  ];

  return {
    mode: env.production ? 'production' : 'development',
    entry: ['./src/index.ts'],
    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
    },
    output: {
      path: process.env.BUILD_PATH
        ? path.resolve(__dirname, process.env.BUILD_PATH)
        : path.resolve(__dirname, 'dist'),
      publicPath: process.env.PUBLIC_PATH,
      filename: 'js/[name].[contenthash].js',
      chunkFilename: 'js/[id].[contenthash].js'
    },
    devServer: env.development
      ? {
          hot: true,
          port: 3000,
          historyApiFallback: true,
          client: {
            overlay: false
          },
          static: {
            directory: path.join(__dirname, 'public')
          },
          watchFiles: ['src/**/*', 'public/**/*'],
          proxy: [
            {
              context: ['/api'],
              target: process.env.PROXY_TARGET || 'http://localhost:8080',
              changeOrigin: true,
              secure: false
            }
          ]
        }
      : undefined,
    plugins,
    target: 'web',
    module: {
      rules: [
        {
          test: /\.m?js/,
          type: 'javascript/auto',
          resolve: {
            fullySpecified: false
          }
        },
        {
          test: /\.(css|s[ac]ss)$/i,
          use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
        },
        {
          test: /\.(ts|tsx|js|jsx)$/,
          exclude: /node_modules/,
          use: 'babel-loader'
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg|webp)$/i,
          type: 'asset/resource'
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name].[contenthash][ext]'
          }
        }
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
      alias: {
        '@': path.resolve(__dirname, 'src/')
      }
    }
  };
};
