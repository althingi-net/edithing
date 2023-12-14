import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import json from 'koa-json';
import logger from 'koa-logger';
import { koaSwagger } from 'koa2-swagger-ui';
import 'reflect-metadata';
import { createKoaServer } from 'routing-controllers';
import setupPassport from './authentication/setupPassport';
import server from './config/server';
import User from './entities/User';
import errorHandler from './middleware/errorHandler';

const app = createKoaServer({
    routePrefix: '/api',
    controllers: [__dirname + '/controllers/!(*.test).ts'],
    authorizationChecker: async (action, roles) => {
        const user = <User>action.context.state.user;

        if (!roles.length) {
            return true;
        }
        
        if (roles.indexOf(user.role) !== -1) {
            return true;
        }
        
        return false;
    },
}) as Koa;

// Application error logging.
app.on('error', console.error);

// Middleware
app.use(errorHandler);
app.use(json());
app.use(logger());
app.use(bodyParser());
setupPassport(app);

// Swagger UI
app.use(
    koaSwagger({
        routePrefix: '/docs',
        swaggerOptions: {
            url: `${server.host}/api/spec.json`,
        },
    }),
);

export default app;