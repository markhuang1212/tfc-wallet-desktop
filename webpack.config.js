const CopyPlugin = require('copy-webpack-plugin');

module.exports = [
  {
    mode: 'development',
    entry: './src/main.ts',
    target: 'electron-main',
    module: {
      rules: [{
        test: /\.ts$/,
        include: /src/,
        use: [{ loader: 'ts-loader' }],
      }],
    },
    output: {
      path: __dirname + '/dist',
      filename: 'main.js',
    },
  },
  {
    mode: 'development',
    entry: './src/ui/index.tsx',
    target: 'electron-renderer',
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
    },
    module: {
      rules: [{
        test: /\.ts(x?)$/,
        include: /src/,
        use: [{ loader: 'ts-loader' }],
      }, {
        test: /\.woff(2?)$/,
        use: [{ loader: 'file-loader' }]
      }, {
        test: /\.css$/,
        use: [{ loader: 'css-loader' }]
      }],
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          { from: 'src/ui/index.html', to: 'index.html' },
        ],
      }),
    ],
    output: {
      path: __dirname + '/dist',
      filename: 'ui.js',
    },
    devServer: {
      port: 6790,
      contentBase: 'dist'
    }
  },
];
