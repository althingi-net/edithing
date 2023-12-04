import HttpStatus from 'http-status-codes';
import { Middleware } from 'koa';

const errorHandler: Middleware = async (ctx, next) => {
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
};

export default errorHandler;