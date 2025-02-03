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
const chalk = require('chalk');

module.exports = (env) => {
  let mode = null;

  if (env.production) {
    console.log(chalk.green('Production 🚀\n'));
    mode = 'production';
  } else if (env.local) {
    console.log(chalk.blue('Local 🏠\n'));
    mode = 'local';
  } else {
    console.log(chalk.yellow('Development 🛠️\n'));
    mode = 'development';
  }

  const dotenvPath = path.resolve(__dirname, `.env.${mode}`);
  require('dotenv').config({ path: dotenvPath });

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
    new DefinePlugin({
      'process.env.MODE': JSON.stringify(mode),
      'process.env.API_URL': JSON.stringify(process.env.API_URL),
      'process.env.API_BASENAME': JSON.stringify(process.env.API_BASENAME),
      'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
    }),
    ...(env.production || env.local
      ? [
          new BundleAnalyzerPlugin({
            analyzerMode: 'static', // 📊 Генерирует HTML файл с отчетом
            openAnalyzer: false, // 🌐 Открывает отчет автоматически в браузере
            reportFilename: 'bundle_report.html' // 📄 Имя файла отчета
          })
        ]
      : []),
    new CleanWebpackPlugin(),
    new Dotenv({
      path: path.resolve(__dirname, `.env.${mode}`)
    }),
    new ModuleFederationPlugin({
      name: 'SpatialData', // 📝 Введите название проекта
      filename: 'remoteEntry.js',
      remotes: {
        MapProvider: "MapProvider@https://sakhagis.ru/mf/map/remoteEntry.js"
        // MapProvider: 'MapProvider@https://yakit.pro/sakhagis/mf/map/remoteEntry.js'
        // MapProvider: 'MapProvider@http://localhost:3000/remoteEntry.js'
      },
      exposes: {
        './SpatialDataComponent': './src/app/App.tsx' // 🧩 Замение "App" - на название компонента, который вы хотите экспортировать
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
          eager: env.production,
          singleton: env.production
        },
        '@radix-ui/react-dialog': { singleton: true, requiredVersion: '^1.1.2' },
        '@radix-ui/react-dropdown-menu': { singleton: true, requiredVersion: '^2.1.2' },
        '@radix-ui/react-popover': { singleton: true, requiredVersion: '^1.1.2' },
        '@radix-ui/react-select': { singleton: true, requiredVersion: '^2.1.1' },
        '@radix-ui/react-tabs': { singleton: true, requiredVersion: '^1.1.0' },
        axios: { singleton: true, requiredVersion: '^1.6.8' },
        classnames: { singleton: true, requiredVersion: '^2.5.1' },
        clsx: { singleton: true, requiredVersion: '^2.1.1' },
        'react-toastify': { singleton: true, requiredVersion: '^10.0.6' }
      }
    })
  ];

  return {
    mode: env.development ? 'development' : 'production',
    entry: ['./src/index.ts'],
    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      publicPath: process.env.PUBLIC_PATH,
      filename: 'js/[name].[contenthash].js',
      chunkFilename: 'js/[id].[contenthash].js'
    },
    devServer: env.development
      ? {
          hot: true,
          port: 3002,
          historyApiFallback: true,
          client: {
            overlay: false
          },
          static: {
            directory: path.join(__dirname, 'public')
          },
          watchFiles: ['src/**/*', 'public/**/*']
        }
      : undefined,
    plugins,
    target: 'web',
    devtool: 'source-map',
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
          test: /\.svg$/,
          use: 'file-loader'
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
