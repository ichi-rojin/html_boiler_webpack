require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })

const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const StylelintPlugin = require('stylelint-webpack-plugin')
const SassLintPlugin = require('sass-lint-webpack')
const PugLintPlugin = require('puglint-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlBeautifierPlugin = require('html-beautifier-webpack-plugin')
const globule = require('globule')
const Aigis = require('node-aigis')
const chokidar = require('chokidar')
const devPort = process.env.PORT
const MODE = process.env.NODE_ENV
const devMode = MODE !== 'production'
const prodMode = MODE === 'production'
// ソースマップの利用有無(productionのときはソースマップを利用しない)
const enabledSourceMap = MODE === 'development'

const src = path.join(__dirname, '/src')
const srcPublic = path.join(src, '/public')
const dist = path.join(__dirname, '/dist')

const binCond = 100 * 1024

const htmlLoaderOptions = {
  minimize: prodMode,
  sources: {
    list: [
      // All default supported tags and attributes
      '...',
      {
        attribute: 'style',
        type: 'src'
      }
    ]
  }
}

if (prodMode) {
  const aigis = new Aigis(path.join(__dirname, '/aigis_config.yml'))
  aigis.run()
}

const devAssets = {
  images: 'assets/img/[name][ext]',
  js: 'assets/js/[name].js',
  css: 'assets/css/[name].css',
  chunkCss: 'assets/css/[id].css'
}
const prodAssets = {
  images: 'assets/img/[name][ext]?cache=[contenthash]',
  js: 'assets/js/[name].js?cache=[contenthash]',
  css: 'assets/css/[name].css?cache=[contenthash]',
  chunkCss: 'assets/css/[id].css?cache=[contenthash]'
}
const assets = (() => {
  if (devMode) {
    return devAssets
  }
  return prodAssets
})()

const imgBaseUrl = (() => {
  const p = path.join(path.relative(__dirname, srcPublic), devAssets.images)
  return path.dirname(p).replaceAll('\\', '/') + '/'
})()

const publicBaseUrl = (() => {
  const p = path.join(path.relative(__dirname, srcPublic), 'public/')
  return path.dirname(p).replaceAll('\\', '/') + '/'
})()

const cache = (() => {
  if (devMode) {
    return {
      type: 'filesystem',
      buildDependencies: {
        config: [__filename]
      }
    }
  }
  return false
})()

const plugins = [
  new MiniCssExtractPlugin({
    filename: assets.css,
    chunkFilename: assets.chunkCss,
    linkType: 'text/css'
  })
]
if (devMode) {
  plugins.push(new StylelintPlugin({
    configFile: '.stylelintrc.yml',
    files: path.join(srcPublic, '/assets/scss/**/*.scss')
  }))
  plugins.push(new SassLintPlugin())
  plugins.push(new PugLintPlugin({
    context: src,
    files: path.relative(srcPublic, '**/*.pug'),
    config: Object.assign({ emitError: true }, require('./.pug-lintrc.json'))
  }))
}

const entryTypes = {
  ejs: 'html',
  pug: 'html'
}
const getEntriesList = (targetTypes) => {
  const entriesList = {}
  for (const [srcType, targetType] of Object.entries(targetTypes)) {
    const filesMatched = globule.find([`**/*.${srcType}`, `!**/_*.${srcType}`], { cwd: srcPublic })

    for (const srcName of filesMatched) {
      const targetName = srcName.replace(new RegExp(`.${srcType}$`, 'i'), `.${targetType}`)
      entriesList[targetName] = `${srcPublic}/${srcName}`
    }
  }
  return entriesList
}
for (const [targetName, srcName] of Object.entries(getEntriesList(entryTypes))) {
  plugins.push(new HtmlWebpackPlugin({
    filename: targetName,
    template: srcName,
    minify: false,
  }))
}
if (prodMode) {
  plugins.push(new HtmlBeautifierPlugin(require('./.beautifierrc.json')))
}

if (devMode) {
  // only enable hot in development
  plugins.push(new webpack.HotModuleReplacementPlugin())
}

module.exports = {
  cache,
  devtool: 'inline-source-map',

  // ES5(IE11等)向けの指定
  target: ['web', 'es5'],

  mode: MODE,
  // メインとなるJavaScriptファイル（エントリーポイント）
  entry: path.join(src, '/main.ts'),
  output: {
    filename: assets.js,
    path: dist,
    assetModuleFilename: (p) => {
      if (p.filename.indexOf(imgBaseUrl) !== -1) {
        const fp = p.filename.replace(imgBaseUrl, '')
        return assets.images.replace('[name][ext]', fp)
      }
      return p.filename.replace(publicBaseUrl, '')
    },
    clean: true
  },
  devServer: {
    static: {
      directory: srcPublic
    },
    open: true,
    // host: '127.0.0.1',
    port: devPort,
    liveReload: false,
    hot: true,
    onBeforeSetupMiddleware: (devServer) => {
      chokidar.watch(path.join(srcPublic, '/**/*.(ejs|pug|json)')).on(
        'all',
        () => {
          devServer.sendMessage(devServer.webSocketServer.clients, 'content-changed')
        }
      )
    }
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        include: [
          src
        ],
        use: 'ts-loader'
      },
      {
        test: /\.js$/,
        include: [
          path.resolve(srcPublic, 'assets/js')
        ],
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      // Sassファイルの読み込みとコンパイル
      {
        test: /\.s[ac]ss/, // 対象となるファイルの拡張子
        include: [
          path.resolve(srcPublic, 'assets')
        ],
        // ローダー名
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader',
            options: {
              // オプションでCSS内のurl()メソッドを取り込む
              url: true,
              // ソースマップの利用有無
              sourceMap: enabledSourceMap,

              // 0 => no loaders (default)
              // 1 => postcss-loader
              // 2 => postcss-loader, sass-loader
              importLoaders: 2
            }
          },
          // PostCSS（autoprefixer）の設定
          {
            loader: 'postcss-loader',
            options: {
              // production モードでなければソースマップを有効に
              sourceMap: enabledSourceMap,
              postcssOptions: {
                // ベンダープレフィックスを自動付与
                plugins: [require('autoprefixer')({ grid: true })]
              }
            }
          },
          // Sassをバンドルするための機能
          {
            loader: 'sass-loader',
            options: {
              // ソースマップの利用有無
              sourceMap: enabledSourceMap
            }
          },
          'import-glob-loader'
        ]
      },
      {
        // 対象となるファイルの拡張子
        test: /\.(gif|png|jpg|jpeg|eot|wof|woff|woff2|ttf|svg|webp)$/,
        include: [
          path.resolve(srcPublic, 'assets/img')
        ],
        // 画像を埋め込まず任意のフォルダに保存する
        type: 'asset',
        parser: {
          dataUrlCondition: {
            // 100KB以上だったら埋め込まずファイルとして分離する
            maxSize: binCond
          }
        }
      },
      {
        test: /\.ejs$/,
        include: [
          srcPublic
        ],
        use: [
          {
            loader: 'html-loader',
            options: htmlLoaderOptions
          },
          {
            loader: 'ejs-plain-loader',
            options: {
              root: srcPublic,
              cache: false
            }
          },
          {
            loader: 'htmlhint-loader',
            options: {
              configFile: '.development.htmlhintrc',
              root: srcPublic
            }
          }
        ]
      },
      {
        test: /\.pug$/,
        include: [
          srcPublic
        ],
        use: [
          {
            loader: 'pug-loader',
            options: {
              self: true,
              pretty: devMode,
              root: srcPublic,
              cache: true,
              esModule: true,
              globals: ['pageID']
            }
          }
        ]
      }
    ]
  },
  resolve: {
    // 拡張子を配列で指定
    extensions: [
      '.ts', '.js'
    ]
  },

  plugins,
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  }
}
