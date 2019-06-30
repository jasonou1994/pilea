import * as webpack from 'webpack'
import HtmlWebPackPlugin from 'html-webpack-plugin'

const htmlPlugin = new HtmlWebPackPlugin({
  template: './ui/index.html',
})

const config: webpack.Configuration = {
  mode: 'development',
  entry: './ui/index.tsx',
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },

  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },
    ],
  },
  // @ts-ignore
  devServer: {
    port: 3000,
  },
  plugins: [htmlPlugin],
}

export default config
