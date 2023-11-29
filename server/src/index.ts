import 'reflect-metadata';
import Koa from 'koa';
import logger from 'koa-logger';
import json from 'koa-json';
import bodyParser from 'koa-bodyparser';
import HttpStatus from 'http-status-codes';
import { createKoaServer } from 'routing-controllers';
import { koaSwagger } from 'koa2-swagger-ui';
import setupDatabase from './setupDatabase';

const PORT = Number(process.env.PORT) || 3003;

const app = createKoaServer({
    routePrefix: '/api',
    controllers: [__dirname + '/controllers/*.ts'],
}) as Koa;

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

// Middleware
app.use(json());
app.use(logger());
app.use(bodyParser());

// Swagger UI
app.use(
    koaSwagger({
        routePrefix: '/docs',
        swaggerOptions: {
            url: `http://localhost:${PORT}/api/spec.json`,
        },
    }),
);

// Start server
setupDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server is running at http://localhost:${PORT}/`);
    });
});