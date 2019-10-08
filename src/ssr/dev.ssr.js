const webpack = require('webpack')
const axios = require('axios')
const MemoryFS = require('memory-fs')
const fs = require('fs')
const path = require('path')
const Koa = require('koa')
const koaStatic = require("koa-static")
const Router = require('koa-router')
// 1、webpack配置文件
const webpackConfig = require('@vue/cli-service/webpack.config')
const { createBundleRenderer } = require("vue-server-renderer");

// 2、编译webpack配置文件
const serverCompiler = webpack(webpackConfig)
const mfs = new MemoryFS()
// 指定输出文件到的内存流中
serverCompiler.outputFileSystem = mfs

// 3、监听文件修改，实时编译获取最新的 vue-ssr-server-bundle.json
let bundle
serverCompiler.watch({}, (err, stats) =>{
    if (err) {
        throw err
    }
    stats = stats.toJson()
    stats.errors.forEach(error => console.error(error) )
    stats.warnings.forEach( warn => console.warn(warn) )
    const bundlePath = path.join(
        webpackConfig.output.path,
        'vue-ssr-server-bundle.json'
    )
    bundle = JSON.parse(mfs.readFileSync(bundlePath,'utf-8'))
    console.log('new bundle generated')
})
// 处理请求
const handleRequest = async ctx => {
    console.log('path', ctx.path)
    if (!bundle) {
        ctx.body = '等待webpack打包完成后在访问在访问'
        return
    }
    // 4、获取最新的 vue-ssr-client-manifest.json
    const clientManifestResp = await axios.get(`http://localhost:${process.env.VUE_APP_CLIENT_PORT}/vue-ssr-client-manifest.json`)
    const clientManifest = clientManifestResp.data

    const renderer = createBundleRenderer(bundle, {
        runInNewContext: false,
        template: fs.readFileSync(path.resolve(__dirname, "../src/index.template.html"), "utf-8"),
        clientManifest: clientManifest
    });
    const html = await renderToString(ctx,renderer)
    ctx.body = html;
}
function renderToString(context,renderer) {
    return new Promise((resolve, reject) => {
        renderer.renderToString(context, (err, html) => {
            err ? reject(err) : resolve(html);
        });
    });
}

const app = new Koa();
const router = new Router()

router.get("*", handleRequest);
app.use(router.routes()).use(router.allowedMethods())
const resolve = file => path.resolve(__dirname, file);
// 开放目录
app.use(koaStatic(resolve("./package/dist")));
module.exports = app