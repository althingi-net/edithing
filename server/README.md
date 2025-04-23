# API Server for edithing frontend app

## Setup on your desktop computer
1. Install NVM node package manager
2. Run `nvm install 22` in the terminal to install nodejs
3. Install Docker: https://docs.docker.com/desktop/
4. Install pnpm with `npm install -g pnpm`
5. Open the [/server](/server) directory in the terminal `cd server`
6. Duplicate [.env.sample](.env.sample) and rename to [.env](.env)
7. Go to https://github.com/settings/tokens and create a token for public repositories (do not choose private, since this token will be in the browser for other users to see)
8. Copy/Paste the token from github into [.env](.env) after the "=" of `GITHUB_TOKEN` (example: `GITHUB_TOKEN=mytokenhere`) 
9. Run `docker-compose up -d` in the terminal to start the database server
10. Run `pnpm i` to install dependencies
11. Run `pnpm run db:seed` to initialize the database with default data for development
12. Start api server by running `pnpm start`

## Services

### Database Admin Panel

http://localhost:8080/

### API Docs UI

http://localhost:3003/docs

### API Docs Specification file

http://localhost:3003/api/spec.json

### MySQL Database

localhost:3306
database name: app
user: root
password: root_password
