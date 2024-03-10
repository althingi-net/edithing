# Setup production

## Using Docker

docker build -t production-image .
docker run -p 127.0.0.1:3000:80 production-image

## Update app from git

git pull
node --max-old-space-size=1000 $(which npm) ci --include=dev
npm run build
pm2 restart all

## Installing onto Debian V10 VPS

### Create github deployment key

- Run this script
  
```bash
ssh-keygen -t ed25519 -C "stefan@edithing.com"

touch ~/.ssh/config
chmod 600 ~/.ssh/config

cat > ~/.ssh/config << EOL
Host github-edithing
    HostName github.com
    AddKeysToAgent yes
    PreferredAuthentications publickey
    IdentityFile ~/.ssh/id_ed25519
EOL

cat ~/.ssh/id_ed25519.pub
```

- Copy text which looks like `ssh-ed25519 AAA...` and create deploy key in github (open edithing repo > settings > deploy key)

### Install Nodejs

sudo apt -y update
sudo apt -y install curl
cd ~
curl -sL https://deb.nodesource.com/setup_18.x -o nodesource_setup.sh
sudo bash nodesource_setup.sh
sudo apt -y install nodejs

sudo apt -y install build-essential

### Install PM2

sudo npm install pm2 -g
sudo pm2 startup

### Install MySQL

sudo apt -y update
sudo apt -y install mariadb-server mariadb-client
sudo mysql_secure_installation

sudo mysql
GRANT ALL ON *.* TO 'admin'@'localhost' IDENTIFIED BY 'password' WITH GRANT OPTION;
FLUSH PRIVILEGES;
exit

### Nginx

sudo apt -y update
sudo apt -y install nginx
systemctl status nginx

### Install Git

sudo apt -y install git

### Setup project

```bash
mkdir project && cd project

git clone --branch develop git@github.com:althingi-net/edithing.git .

node --max-old-space-size=1000 $(which npm) ci --include=dev
npm run build

```

### Setup backend

- Set ENV server configuration

```bash
nano ../production/process.yml
```

or

```bash
cat > ./production/process.yml << EOL
apps:
  - script: './server/dist/index.js'
    exec_mode: 'fork'
    name: 'worker-0'
    env:
        PORT: 3500
        NODE_ENV: production
        DISABLE_GITHUB: false
        GITHUB_TOKEN: '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'
        DEBUG: false
        DATABASE_NAME: 'app'
        DATABASE_USER: 'admin'
        DATABASE_PASSWORD: 'password'
        JWT_SECRET: 'hgr6a7s8diouisyaud78uikj^&%'
  - script: './server/dist/index.js'
    exec_mode: 'fork'
    name: 'worker-1'
    env:
        PORT: 3501
        NODE_ENV: production
        DISABLE_GITHUB: false
        GITHUB_TOKEN: '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'
        DEBUG: false
        DATABASE_NAME: 'app'
        DATABASE_USER: 'admin'
        DATABASE_PASSWORD: 'password'
        JWT_SECRET: 'hgr6a7s8diouisyaud78uikj^&%'
EOL

```

### Start PM2 node processes

```bash
pm2 start --watch ./server production/process.yml
```

### Setup Ngninx

- Edit nginx config and replace config entirely with [nginx.conf](nginx.conf)

```bash

cat > /etc/nginx/sites-available/default << EOL
upstream loadbalancer {
  least_conn;
  server localhost:3500;
  server localhost:3501;
}

server {
    listen 80 default_server;
    listen [::]:80 default_server;

    error_log  /var/log/nginx/error_log  crit;

    index index.html index.htm index.nginx-debian.html;
    server_name example.com www.example.com;

    # react app & front-end files
    location / {
        root /var/www/project;
        # root ~/project/client/dist;
        try_files \$uri /index.html;
    }

    location /api/ {
        proxy_pass http://loadbalancer/api/;
        proxy_buffering         on;
    }

}
EOL

```

- Replace 'example.com' with the actual domain
- Test and reload config

```bash
sudo rsync -av ./client/dist/. /var/www/project

sudo nginx -t
sudo systemctl reload nginx

```


## Installing onto Ubuntu VPS

```bash

curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

sudo apt-get update && apt-get install -y \
    nginx \
    nodejs \
    npm \
    mysql-server

sudo npm install -g pm2@latest
```

### Setup Firewall (doesnt work within docker)

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
sudo ufw status
```

### Install SSL

```bash
sudo snap install core
sudo snap refresh core
sudo snap install --classic certbot
```

### Setup MySQL

```bash
sudo systemctl start mysql.service
sudo mysql_secure_installation
sudo mysql -uroot -p -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your-password';"
```

### Test nginx is working

```bash
curl -I 127.0.0.1
```

### Create github deployment key

- Run this script
  
```bash
ssh-keygen -t ed25519 -C "stefan@edithing.com"

touch ~/.ssh/config
chmod 600 ~/.ssh/config

cat > ~/.ssh/config << EOL
Host github-edithing
    HostName github.com
    AddKeysToAgent yes
    PreferredAuthentications publickey
    IdentityFile ~/.ssh/id_ed25519
EOL

cat ~/.ssh/id_ed25519.pub
```

- Copy text which looks like `ssh-ed25519 AAA...` and create deploy key in github (open edithing repo > settings > deploy key)

### Setup project

```bash
mkdir project && cd project

git clone --branch main git@github.com:althingi-net/edithing.git .

node --max-old-space-size=1000 $(which npm) ci --include=dev
npm run build

```

### Setup backend

- Set ENV server configuration

```bash
nano ../production/process.yml
```

or

```bash
cat > ../production/process.yml << EOL
apps:
  - script: '../server/dist/index.js'
    exec_mode: 'fork'
    name: 'worker-0'
    env:
        PORT: 3500
        NODE_ENV: production
        DISABLE_GITHUB: false
        GITHUB_TOKEN: ''
        DEBUG: false
        DATABASE_NAME: 'app'
        DATABASE_USER: 'root'
        DATABASE_PASSWORD: 'your-password'
        JWT_SECRET: ''
  - script: '../server/dist/index.js'
    exec_mode: 'fork'
    name: 'worker-1'
    env:
        PORT: 3501
        NODE_ENV: production
        DISABLE_GITHUB: false
        GITHUB_TOKEN: ''
        DEBUG: false
        DATABASE_NAME: 'app'
        DATABASE_USER: 'root'
        DATABASE_PASSWORD: 'your-password'
        JWT_SECRET: ''
EOL
```

### Setup PM2

```bash
pm2 start production/process.yml
```

### Setup Ngninx

- Edit nginx config and replace config entirely with [nginx.conf](nginx.conf)

```bash
sudo nano /etc/nginx/sites-available/default
```

- Replace 'example.com' with the actual domain
- Test and reload config

```bash
sudo rsync -av ./client/dist/. /var/www/project

sudo nginx -t
sudo systemctl reload nginx
```

### Setup https

- Run this command to automatically issue and configure nginx for the domain set in nginx.conf

```bash
sudo certbot --nginx
```