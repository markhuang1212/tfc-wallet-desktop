const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = [
  {
    mode: 'development',
    entry: './src/main.ts',
    target: 'electron-main',
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
      alias: {
        // 'scrypt.js': path.resolve(__dirname, '../node_modules/scrypt.js/js.js'),
        'swarm-js': path.resolve(__dirname, './node_modules/swarm-js/lib/api-browser.js'),
        // 'fs': path.resolve(__dirname, '../src/app/fs-fake.js'),
      }
    },
    module: {
      rules: [{
        test: /\.ts$/,
        include: /src/,
        exclude: /__test__/,
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
