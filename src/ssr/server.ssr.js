const fs = require("fs");
const Koa = require("koa");
const path = require("path");
const koaStatic = require('koa-static');
const createApp = require('../main');
const app = new Koa();
const resolve = file => path.resolve(__dirname, file);
// 开放dist目录
app.use(koaStatic(resolve('./dist')));
// 获得一个createBundleRenderer
const { createBundleRenderer } = require("vue-server-renderer");
const bundle = require("./dist/vue-ssr-server-bundle.json");
const clientManifest = require("./dist/vue-ssr-client-manifest.json");
const renderer = createBundleRenderer(bundle, {
    runInNewContext: false,
    template: fs.readFileSync(resolve("./dist/index.html"), "utf-8"),
    clientManifest: clientManifest
});
function renderToString(createApp) {
    return new Promise((resolve, reject) => {
        renderer.renderToString(createApp, (err, html) => {
            err ? reject(err) : resolve(html);
        });
    });
};

//添加一个中间件来处理所有请求
app.use(async (ctx, next) => {
    const context = {url: ctx.url};
    const createApp = createApp(context)
    // 将 context 数据渲染为 HTML
    const html = await renderToString(createApp);
    ctx.body = html;
});
module.exports = app