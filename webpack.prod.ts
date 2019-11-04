import * as path from 'path'
import * as webpack from 'webpack'
import HtmlWebPackPlugin from 'html-webpack-plugin'

const htmlPlugin = new HtmlWebPackPlugin({
  template: './ui/index.html',
})

const config: webpack.Configuration = {
  mode: 'production',
  entry: './ui/index.tsx',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },

  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [htmlPlugin],
}

export default config
