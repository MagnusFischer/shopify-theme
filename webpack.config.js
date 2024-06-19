const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const hashTemplate = process.env.NODE_ENV === 'production' ? '[contenthash]' : '[contenthash:8]';

module.exports = (env) => ({
  ...(process.env.NODE_ENV !== 'production' && {
    devtool: 'source-map',
  }),

  ...(process.env.NODE_ENV === 'production' && {
    mode: 'production',
  }),

  entry: {
    app: {
      import: path.join(__dirname, 'resources/app'),
    },
  },

  output: {
    filename: '[name].js',
    chunkFilename: `module.[chunkhash].js?v=${hashTemplate}`,
    sourceMapFilename: `[name][ext].map?v=${hashTemplate}`,
    path: path.join(__dirname, 'src/assets'),
    clean: true,
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: env?.STATS || 'disabled',
    }),
  ],

  resolve: {
    alias: {
      app: path.join(__dirname, 'resources/app'),
      '@ts': path.join(__dirname, 'resources/types'),
      '@utils': path.join(__dirname, 'resources/scripts/utils'),
      '@components': path.join(__dirname, 'resources/scripts/components'),
      '@pages': path.join(__dirname, 'resources/scripts/pages'),
      '@vendor': path.join(__dirname, 'resources/scripts/vendor'),
    },
    extensions: ['.tsx', '.ts', '.js'],
    modules: ['node_modules', path.resolve(__dirname, 'resources/scripts')],
  },

  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        exclude: /(node_modules)/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: false,
            },
          },
          'postcss-loader',
        ],
      },
    ],
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        defaultVendors: false,
      },
    },
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true },
            },
          ],
        },
      }),
    ],
  },
});
