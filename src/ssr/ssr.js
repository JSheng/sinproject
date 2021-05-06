const isDev = process.env.NODE_ENV !== 'production'
const app = isDev ? require('./dev.ssr') : require('./server.ssr');
const port = process.env.VUE_APP_SERVER_PORT;
app.listen(port, function() {
    console.log(`server started at localhost:${port}`);
});

module.exports = app;
