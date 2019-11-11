const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const autoprefixerStylus = require('autoprefixer-stylus');
const autoprefixer = require('autoprefixer');
const path = require('path');
const overrideBrowserslist = [
  'ie >= 8',
  'last 4 version',
];

module.exports = {
  mode: process.env.NODE_ENV,
  node: false,

  entry: __dirname + "/src/index.js",  // webpack entry point. Module to start building dependency graph
 
  output: {
    path: __dirname + "/dist/", // Folder to store generated bundle
    filename: "bundle.js", // Name of generated bundle after build
    //publicPath: __dirname + "/build/" // public URL of the output directory when referenced in a browser
  },

  resolve: {
    extensions: [ ".js", ".svelte" ],
    // root: path.resolve(__dirname, 'src'),
    alias: {
      "@": path.resolve(__dirname, 'src'),
      "@js": path.resolve(__dirname, 'src/js'),
      "@css": path.resolve(__dirname, 'src/css'),
      "@tpl": path.resolve(__dirname, 'src/tpl')
    }
  },

  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCssAssetsPlugin({})],
  },

  module: {
    rules: [
      {
        test: /.\js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          query: {
            presets: [
              [
                "@babel/preset-env", {
                  targets: "> 0.25%, not dead",
                  useBuiltIns: 'usage',
                  modules: false
               }
              ]
            ],
            // ignore: ['*.ejs']
          }
        }
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // only enable hot in development
              hmr: process.env.NODE_ENV === 'development',
              // if hmr does not work, this is a forceful method.
              reloadAll: true,
            },
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                autoprefixer({ overrideBrowserslist })
              ],
            }
          },
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
              sassOptions: {
                fiber: false,
              },
            },
          }
        ],
      },
      {
        test: /\.styl$/,
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // only enable hot in development
              hmr: process.env.NODE_ENV === 'development',
              // if hmr does not work, this is a forceful method.
              reloadAll: true,
            },
          },
          'css-loader',
          {
            loader: 'stylus-loader',
            options: {
              use: [autoprefixerStylus({ overrideBrowserslist })]
            }
          }
        ],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "ejs-template-loader",
          }
        ]
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        use: [
          "file-loader"
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // all options are optional
      filename: '[name].css',
      chunkFilename: '[id].css',
      ignoreOrder: false, // Enable to remove warnings about conflicting order
    }),

    new HtmlWebpackPlugin({
      title: "Bannermaker 2.0",
      template: __dirname + "/src/index.html",
      filename: __dirname + "/dist//index.html"
    })
  ]
};