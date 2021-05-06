const fs = require("fs");
const Koa = require("koa");
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const path = require("path");
const koaStatic = require('koa-static');
const { historyApiFallback } = require('koa2-connect-history-api-fallback');
const createApp = require('../main');
const app = new Koa();
const koaRouter = new Router();
const resolve = file => path.resolve(__dirname, file);


// koa2-connect-history-api-fallback中间件一定要放在静态资源服务中间件前面加载
app.use(historyApiFallback({
        index: '/index.html'
    }))
    // 配置post中间件
    .use(bodyParser())
    // 配置静态资源服务中间件，指定域名根目录的映射
    .use(koaStatic(resolve('./dist')));

// 获得一个createBundleRenderer
const { createBundleRenderer } = require("vue-server-renderer");
const bundle = require("./dist/vue-ssr-server-bundle.json");
const clientManifest = require("./dist/vue-ssr-client-manifest.json");
const renderer = createBundleRenderer(bundle, {
    runInNewContext: false,
    template: fs.readFileSync(resolve("./dist/index.html"), "utf-8"),
    clientManifest: clientManifest
});
// eslint-disable-next-line no-shadow
function renderToString(createApp) {
  // eslint-disable-next-line no-shadow
    return new Promise((resolve, reject) => {
        renderer.renderToString(createApp, (err, html) => {
            err ? reject(err) : resolve(html);
        });
    });
};
// 处理请求
const handleRequest = async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', ctx.request.header.origin);
  ctx.set('Access-Control-Allow-Credentials', true);

  //防止每次请求都返回Access-Control-Allow-Methods以及Access-Control-Max-Age，
  //这两个响应头其实是没有必要每次都返回的，只是第一次有预检的时候返回就可以了。
  if (ctx.method === 'OPTIONS') {
    ctx.set('Access-Control-Allow-Methods', 'PUT,DELETE,POST,GET');
    ctx.set('Access-Control-Max-Age', 3600 * 24);
    ctx.body = '';
   }
  // 将 context 数据渲染为 HTML
  const html = await renderToString(ctx);
  ctx.body = html;
}
koaRouter.get("*", handleRequest);
app.use(koaRouter.routes()).use(koaRouter.allowedMethods());

module.exports = app
