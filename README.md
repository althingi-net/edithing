# Tech-stack

## How to run

```bash
# Run MySQL and RabbitMQ
docker-compose up -d

# Install dependencies
npm install

# Init database (will drop existing tables)
cd server && npm run db:seed

# Run all lib build scripts, api server, message queue consumer, and client
npm run start
```

## Requirements

- Node v18
- MySQL v8
- RabbitMQ v3

## Frameworks

- [React](https://react.dev/)
- [Ant Design](https://ant.design/)
- [Koa](https://koajs.com/)
- [TypeORM](https://typeorm.io/)

## Libraries

- [Koa routing-controllers](https://github.com/typestack/routing-controllers)
- [OpenAPI TypeScript](https://openapi-ts.pages.dev/)
- [OpenAPI TypeScript CodeGen](https://github.com/ferdikoomen/openapi-typescript-codegen) (deprecated soon)
- [Fast XML Parser](https://github.com/NaturalIntelligence/fast-xml-parser#readme)
- [Octokit](https://github.com/octokit)
- [Slate](https://www.slatejs.org/)
- [Jest](https://jestjs.io/)
- [Lerna](https://lerna.js.org/)
- [Parcel](https://parceljs.org/languages/typescript/)

## Tools

- [PM2](https://pm2.keymetrics.io/) (production)
- [Docker](https://www.docker.com/) (development)
