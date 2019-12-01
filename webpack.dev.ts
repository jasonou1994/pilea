import * as webpack from 'webpack'
import HtmlWebPackPlugin from 'html-webpack-plugin'

const config = (env: any): webpack.Configuration => {
  const API_PORT = env ? env.API_PORT : undefined
  const API_HOST = env ? env.API_HOST : undefined
  const API_PROTOCOL = env ? env.API_PROTOCOL : undefined

  return {
    mode: 'development',
    entry: './ui/index.tsx',
    output: {
      filename: 'bundle.js',
      publicPath: '/',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.json', '.scss', '.css'],
    },
    devtool: 'source-map',

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'awesome-typescript-loader',
        },
        {
          test: /\.(sc|c)ss$/i,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
      ],
    },
    // @ts-ignore
    devServer: {
      port: 3000,
      historyApiFallback: true,
      open: false,
    },
    plugins: [
      new HtmlWebPackPlugin({
        template: './ui/index.html',
      }),
      new webpack.DefinePlugin({
        'process.env.API_PORT': API_PORT
          ? JSON.stringify(API_PORT)
          : JSON.stringify('80'),
        'process.env.API_HOST': API_HOST
          ? JSON.stringify(API_HOST)
          : JSON.stringify('localhost'),
        'process.env.API_PROTOCOL': API_PROTOCOL
          ? JSON.stringify(API_PROTOCOL)
          : JSON.stringify('http'),
      }),
    ],
  }
}

export default config
