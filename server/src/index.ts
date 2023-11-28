import Koa from 'koa';
import Router from 'koa-router';
import logger from 'koa-logger';
import json from 'koa-json';
import bodyParser from 'koa-bodyparser';
import HttpStatus from 'http-status-codes';

const PORT = Number(process.env.PORT) || 3000;

const app = new Koa();
const router = new Router();

// Generic error handling middleware.
app.use(async (ctx, next) => {
    try {
        await next();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        if (process.env.NODE_ENV === 'production') {
            console.error(error);
            ctx.status = HttpStatus.INTERNAL_SERVER_ERROR;
            ctx.body = 'Internal Server Error';
        } else {
            ctx.status = error.statusCode || error.status || HttpStatus.INTERNAL_SERVER_ERROR;
            error.status = ctx.status;
            ctx.body = { error };
            ctx.app.emit('error', error, ctx);
        }
    }
});

// Application error logging.
app.on('error', console.error);

router.get('/', async (ctx, next) => {
    ctx.body = 'Hello World';

    await next();
});

// Middleware
app.use(json());
app.use(logger());
app.use(bodyParser());

// Routes
app.use(router.routes()).use(router.allowedMethods());

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}/`);
});