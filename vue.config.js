const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const nodeExternals = require('webpack-node-externals')
const GeneraterAssetPlugin = require('generate-asset-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const merge = require('lodash.merge')
const path = require('path')

const TARGET_NODE = process.env.WEBPACK_TARGET === 'node'
const target = TARGET_NODE ? 'server' : 'client'
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)

const serverConfig = require('./serverConfig.json')
var createServerConfig = function (compilation) {
  return JSON.stringify(serverConfig)
}

module.exports = {
  publicPath: 'http://localhost:8080/'+process.env.VUE_APP_PROJECT_NAME+'/', // 默认'/'，部署应用包时的基本 URL
  outputDir: './package/dist', // 构建输出目录
  lintOnSave: true, // 是否在保存的时候检查
  productionSourceMap: !IS_PROD, // 生产环境是否生成 sourceMap 文件
  runtimeCompiler: true, // 是否使用包含运行时编译器的 Vue 构建版本
  devServer: {
    headers: { 'Access-Control-Allow-Origin': '*' },
    https: false,
    port: process.env.VUE_APP_CLIENT_PORT || 8080,
    proxy: {
      '/iindApi/': {
        target: process.env.VUE_APP_PROXY_URL,
        changeOrigin: true,
        pathRewrite: { "^/iindApi" : "" }
      }
    }
  },
  // css: {
  //   extract: IS_PROD, // 是否使用css分离插件 ExtractTextPlugin
  //   sourceMap: !IS_PROD, // 开启 CSS source maps
  //   loaderOptions: {// css预设器配置项
  //   },
  //   requireModuleExtension: false// 启用 CSS modules for all css / pre-processor files.
  // },
  configureWebpack: () => ({
    // 将 entry 指向应用程序的 server / client 文件
    entry: `./src/ssr/entry-${target}.js`,
    // 对 bundle renderer 提供 source map 支持
    devtool: 'source-map',
    target: TARGET_NODE ? 'node' : 'web',
    node: TARGET_NODE ? undefined : false,
    output: {
      libraryTarget: TARGET_NODE ? 'commonjs2' : undefined
    },
    // 外置化应用程序依赖模块。可以使服务器构建速度更快，
    // 并生成较小的 bundle 文件。
    externals: TARGET_NODE ?
      nodeExternals({
        // 不要外置化 webpack 需要处理的依赖模块。
        // 你可以在这里添加更多的文件类型。例如，未处理 *.vue 原始文件，
        // 你还应该将修改 `global`（例如 polyfill）的依赖模块列入白名单
        whitelist: [/\.css$/,/\.sass$/,/\.vue$/]
      })
      : undefined,
    optimization: {
      splitChunks: TARGET_NODE?undefined:{
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 300000, // 依赖包超过300000bit将被单独打包
        automaticNameDelimiter:'-',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
              return `chunk.${packageName.replace('@', '')}`;
            },
            priority:-10
          }
        }
      }
    },
    plugins: [TARGET_NODE ? new VueSSRServerPlugin() : new VueSSRClientPlugin()]
  }),
  chainWebpack: config => {
    config.resolve.alias
            .set('@', path.resolve('src'))
            .set('@components', path.resolve('src/components'))
            .set('@assets', path.resolve('src/assets'))
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => {
        // 修改它的选项...
        options.limit = 100
        return options
      })
      /* config.module
        .rule('type-script')
        .test(/\.tsx?$/) //loader加载的条件是ts或tsx后缀的文件
        .use('ts-loader')
        .options({ //ts-loader相关配置
          transpileOnly: true,
          appendTsSuffixTo: ['\\.vue$']
        }) */
      config.module
      .rule('vue')
      .test(/\.vue$/)// 匹配.vue文件
      .use('vue-loader')
      .tap(options => {
        merge(options, {
          optimizeSSR: false
        })
      })
    if (process.env.NODE_ENV === 'production') {
      config.plugin('extract-css').tap(() => [{
        path: path.join(__dirname, './package/dist'),
        filename: 'css/[name].[contenthash:8].css'
      }])
      config.plugin('generate-asset').use(GeneraterAssetPlugin, [{
        filename: './serverConfig.json', // 输出到dist根目录下的serverConfig.json文件,名字可以按需改
        fn: (compilation, cb) => {
          cb(null, createServerConfig(compilation))
        }
      }])
      config.plugin('copy').use(CopyWebpackPlugin, [[
        {
          from: path.resolve(__dirname, './processes.json'),
          to: path.resolve(__dirname, './package')
        }, {
          from: path.resolve(__dirname, './src/ssr/ssr.js'),
          to: path.resolve(__dirname, './package')
        }, {
          from: path.resolve(__dirname, './src/ssr/server.ssr.js'),
          to: path.resolve(__dirname, './package')
        }, {
          from: path.resolve(__dirname, './src/ssr/dev.ssr.js'),
          to: path.resolve(__dirname, './package')
        }
      ]])
    }

    // fix ssr hot update bug
    if (TARGET_NODE) {
      config.optimization.delete('splitChunks')
      config.resolve.symlinks(true)
    }

    config.plugin('html').tap(args => {
      args[0].chunksSortMode = 'none'
      return args
    })
    // 防止将某些 import 的包(package)打包到 bundle 中，而是在运行时(runtime)再去从外部获取这些扩展依赖
    config.externals = {
      'vue': 'Vue',
      'iview': 'iView',
      'vue-router': 'VueRouter',
      'vuex': 'Vuex',
      'axios': 'axios'
    }
  },
  pluginOptions: {// 第三方插件配置
  }
}
