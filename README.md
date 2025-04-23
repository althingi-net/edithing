# Tech-stack

## How to run

```bash
# Install pnpm (if not already installed)
npm install -g pnpm

# Run MySQL and RabbitMQ
docker-compose up -d

# Install dependencies
pnpm install

# Init database (will drop existing tables)
cd server && pnpm run db:seed

# Run all lib build scripts, api server, message queue consumer, and client
pnpm run start
```

## Requirements

- Node v22+ 
- pnpm v8+
- MySQL v8
- RabbitMQ v3

## Documentation

### Architecture Diagrams
- [Client Flow](docs/client-flow.mmd) - React application structure and component hierarchy
- [Server Flow](docs/server-flow.mmd) - Backend architecture and request flow
- [Law Document Flow](docs/law-document-flow.mmd) - Document structure and processing pipeline
- [Law Document Editor Flow](docs/law-document-editor-flow.mmd) - Editor component architecture
- [Git JSON Merger Flow](docs/git-json-merger-flow.mmd) - JSON merging process and Git operations
- [Client SDK Flow](docs/client-sdk-flow.mmd) - SDK architecture and API interactions

### Implementation Details
- [Slate Editor Documentation](docs/slate-editor.md) - Detailed documentation of the legal document editor implementation

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
- [Turborepo](https://turbo.build/)
- [Parcel](https://parceljs.org/languages/typescript/)

## Tools

- [PM2](https://pm2.keymetrics.io/) (production)
- [Docker](https://www.docker.com/) (development)
