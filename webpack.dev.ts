import * as webpack from 'webpack'
import HtmlWebPackPlugin from 'html-webpack-plugin'

const htmlPlugin = new HtmlWebPackPlugin({
  template: './ui/index.html',
})

const config: webpack.Configuration = {
  mode: 'development',
  entry: './ui/index.tsx',
  output: {
    // path: 'build',
    filename: 'bundle.js',
    publicPath: '/',
  },
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  devtool: 'source-map',

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  // @ts-ignore
  devServer: {
    port: 3000,
    historyApiFallback: true,
  },
  plugins: [htmlPlugin],
}

export default config
