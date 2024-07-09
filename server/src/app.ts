import { Logger } from '@hocuspocus/extension-logger';
import { Server } from '@hocuspocus/server';
import cors from '@koa/cors';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import helmet from 'koa-helmet';
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
    controllers: [__dirname + '/controllers/!(*.test).{ts,js}'],
    authorizationChecker: (action, roles) => {
        const user = <User>action.context.state.user;

        if (!roles.length) {
            return true;
        }
        
        if (roles.indexOf(user.role) !== -1) {
            return true;
        }
        
        return false;
    },
    // defaultErrorHandler: false,
}) as Koa;

// Application error logging.
app.on('error', console.error);

// Middleware
app.use(errorHandler);
app.use(json());
app.use(logger());
app.use(bodyParser());
setupPassport(app);

// Setup realtime collaboration server
// Note: Some extensions use the onRequest, onUpgrade and onListen hooks, that will not be fired in this configuration.
const hocuspocus = Server.configure({
    port: 4523,
    extensions: [new Logger({
        onLoadDocument: true,
        onChange: true,
        onStoreDocument: true,
        onConnect: true,
        onDisconnect: true,
        onUpgrade: true,
        onRequest: true,
        onDestroy: true,
        onConfigure: true,
    })],
    // debounce: 1000,

    async onStoreDocument(data) {
        // Save to database. Example:
        // saveToDatabase(data.document, data.documentName);
        console.log('onStoreDocument', data);

        await new Promise((resolve) => setTimeout(resolve, 1000));
    },

    async onLoadDocument(data) {
        console.log('onLoadDocument', data);
        // return loadFromDatabase(data.documentName) || createInitialDocTemplate();
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return {};
    },
});
void hocuspocus.listen();

// app.use(websocket());
// app.use(async (ctx, next) => {
//     if (ctx.ws) {
//         const ws = await ctx.ws();
  
//         hocuspocus.handleConnection(
//             ws,
//             ctx.req,
//             {
//                 userId: ctx.state.user.id,
//             }
//         );
//     }

//     await next();
// });

// Security
if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
    app.use(cors());
}

// Swagger UI
if (process.env.NODE_ENV !== 'production') {
    app.use(
        koaSwagger({
            routePrefix: '/docs',
            swaggerOptions: {
                url: `${server.host}/api/spec.json`,
            },
        }),
    );
}

export default app;