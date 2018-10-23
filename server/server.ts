import Koa from 'koa';
import koaBody from 'koa-body';
import logger from 'koa-logger';
import KoaRouter from 'koa-router';
import serve from 'koa-static';
import views from 'koa-views';
import path from 'path';
import axios from 'axios';
import session from 'koa-session';
import KoaWebsocket from 'koa-websocket';

const app: KoaWebsocket.App = KoaWebsocket(new Koa());
const router: KoaRouter = new KoaRouter();
const wsRouter: KoaRouter = new KoaRouter();

// Session configuration
app.keys = ['key'];
const sessionConfig = {
  key: 'koa:sess',
  maxAge: 86400000,
  overwrite: true,
  httpOnly: true,
  secure: true,
  signed: true,
  rolling: false,
  renew: false
};

app.use(session(sessionConfig, app));

// Renders (views)
const render: Koa.Middleware = views(path.join(__dirname, 'build'));

// Configure assets path like ASSETS_PATHS="['./build', './build/static/css']"
const assetsPathsString: string = process.env.ASSETS_PATHS || '["./build"]';
let assetsPaths: string[] = [];
try {
  assetsPaths = JSON.parse(assetsPathsString);
  if (!Array.isArray(assetsPaths)) {
    throw new Error('Invalid assets path error. ASSETS_PATHS should be Array.');
  }
} catch (e) {
  console.error(e);
  process.exit(1);
}

// Apply Middlewares
assetsPaths.forEach((a: string) => app.use(serve(a)));
app.use(logger());
app.use(render);
app.use(koaBody());

// Define routings
router.get('/', index);
app.use(router.routes());

wsRouter.get('/', wsIndex);
// @ts-ignore
app.ws.use(wsRouter.routes());

async function index(ctx: Koa.Context) {
  await ctx.render('index.html');
  return;
}

async function wsIndex(ctx: any) {
  console.log('wsIndex');
  ctx.websocket.on('message', (message: any) => {
    const now = Date.now();
    const date = new Date(now);
    const m = date.getMonth() + 1;
    const d = date.getDate();
    const yearString = date.getFullYear();
    const monthString = m < 10 ? `0${m}` : m;
    const dateString = d < 10 ? `0${d}` : d;
    const str = `${yearString}:${monthString}:${dateString} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

    (app.ws as any).server.clients.forEach((client: any) => {
      client.send(message);
      console.log(str, ' ', message);
    });
  });
}

const port = process.env.SERVER_PORT || 3000;
// Listener
if (!module.parent) {
  console.log(`Now Listening on localhost:${port}`);
  app.listen(port);
}
