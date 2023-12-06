# API Server for edithing frontend app

## Setup on your desktop computer
1. Install Docker: https://docs.docker.com/desktop/
2. Open the [/server](/server) directory in the terminal `cd server`
2. Run `docker-compose up -d` in the terminal to start the database server
3. Run `npm i` to install dependencies
4. Run `npm run db:seed` to initialize the database with default data for development
5. Start api server by running `npm start`

