# API Server for edithing frontend app

## Setup on your desktop computer
1. Install Docker: https://docs.docker.com/desktop/
2. Open the [/server](/server) directory in the terminal `cd server`
3. Duplicate [.env.sample](.env.sample) and rename to [.env](.env)
4. Go to https://github.com/settings/tokens and create a token for public repositories (do not choose private, since this token will be in the browser for other users to see)
5. Copy/Paste the token from github into [.env](.env) after the "=" of `GITHUB_TOKEN` (example: `GITHUB_TOKEN=mytokenhere`) 
6. Run `docker-compose up -d` in the terminal to start the database server
7. Run `npm i` to install dependencies
8. Run `npm run db:seed` to initialize the database with default data for development
9. Start api server by running `npm start`

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
