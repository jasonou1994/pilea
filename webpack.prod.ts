import * as path from 'path'
import * as webpack from 'webpack'
import HtmlWebPackPlugin from 'html-webpack-plugin'

const config = (env: any): webpack.Configuration => {
  const API_PORT = env ? env.API_PORT : undefined
  const API_HOST = env ? env.API_HOST : undefined

  return {
    mode: 'production',
    entry: './ui/index.tsx',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'bundle.js',
      publicPath: '/',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.json', '.scss', '.css'],
    },

    module: {
      rules: [
        { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },
        {
          test: /\.(sc|c)ss$/i,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
      ],
    },
    plugins: [
      new HtmlWebPackPlugin({
        template: './ui/index.html',
      }),
      new webpack.DefinePlugin({
        'process.env.API_PORT': API_PORT ? JSON.stringify(API_PORT) : '80',
        'process.env.API_HOST': API_HOST
          ? JSON.stringify(API_HOST)
          : 'mypilea.com',
      }),
    ],
  }
}

export default config
