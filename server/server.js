"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const koa_body_1 = __importDefault(require("koa-body"));
const koa_logger_1 = __importDefault(require("koa-logger"));
const koa_router_1 = __importDefault(require("koa-router"));
const koa_static_1 = __importDefault(require("koa-static"));
const koa_views_1 = __importDefault(require("koa-views"));
const path_1 = __importDefault(require("path"));
const koa_session_1 = __importDefault(require("koa-session"));
const koa_websocket_1 = __importDefault(require("koa-websocket"));
const app = koa_websocket_1.default(new koa_1.default());
const router = new koa_router_1.default();
const wsRouter = new koa_router_1.default();
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
app.use(koa_session_1.default(sessionConfig, app));
// Renders (views)
const render = koa_views_1.default(path_1.default.join(__dirname, 'build'));
// Configure assets path like ASSETS_PATHS="['./build', './build/static/css']"
const assetsPathsString = process.env.ASSETS_PATHS || '["./build"]';
let assetsPaths = [];
try {
    assetsPaths = JSON.parse(assetsPathsString);
    if (!Array.isArray(assetsPaths)) {
        throw new Error('Invalid assets path error. ASSETS_PATHS should be Array.');
    }
}
catch (e) {
    console.error(e);
    process.exit(1);
}
// Apply Middlewares
assetsPaths.forEach((a) => app.use(koa_static_1.default(a)));
app.use(koa_logger_1.default());
app.use(render);
app.use(koa_body_1.default());
// Define routings
router.get('/', index);
app.use(router.routes());
wsRouter.get('/', wsIndex);
// @ts-ignore
app.ws.use(wsRouter.routes());
function index(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        yield ctx.render('index.html');
        return;
    });
}
function wsIndex(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        ctx.websocket.on('message', (message) => {
            const now = Date.now();
            const date = new Date(now);
            const m = date.getMonth() + 1;
            const d = date.getDate();
            const yearString = date.getFullYear();
            const monthString = m < 10 ? `0${m}` : m;
            const dateString = d < 10 ? `0${d}` : d;
            const str = `${yearString}:${monthString}:${dateString} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
            app.ws.server.clients.forEach((client) => {
                client.send(message);
                console.log(str, ' ', message);
            });
        });
    });
}
const port = process.env.SERVER_PORT || 3000;
// Listener
if (!module.parent) {
    console.log(`Now Listening on localhost:${port}`);
    app.listen(port);
}
