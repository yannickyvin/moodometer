# sushimeter - a team mood tracker (inspired by slavagu/moodometer)

A simple app to capture team mood and see how it changes over time.

Differences between this moodmeter and original project :
> Anonymous vote with uniq ID generation attached to navigator (local storage used => https necessary on recent navigators)

> Add Emoji icons and some functional improvements

> Change API and DB structure (switched DynamoDB to PostgreSQL DB and project is no more serverless)

# Installation

# Pre requisite 
* postgreSQL (>= 11) https://www.postgresql.org/download/ (dev & prod)
* nodeJS (>= 10) https://nodejs.org/en/download/ (dev & prod)
* nginx http://nginx.org/en/download.html (prod only)
* pm2 https://www.npmjs.com/package/pm2 (prod only)

/!\ Using navigator local storage (recording an uniq id) => in production environnement https domain is necessary for a functionnal app. 
You can install a free let's encrypt certificate : https://letsencrypt.org/

## Get Moodometer Sources & install API & front APP
```bash
git clone git@github.com:yannickyvin/moodometer.git
cd ~/moodometer
npm install
cd ~/moodometer/api
npm install
```

## Install MoodDB and create mood table
1 - Create mood Database on postgreSQL with user/pwd of your choice

2 - Create mood table from sql script : ~/api/mood.sql

## Set API & Front Configuration 

### API Configuration
1 - create ./api/.env file and add this content (replace values when necessary) :
```
# environment (development or production)
NODE_ENV=development
# IP Host of your PostgreSQL instance database - 127.0.0.1 if your database is on same server 
DB_HOST=127.0.0.1
# Name of your PostgreSQL instance database
DB_DATABASENAME=mood
# Name of your PostgreSQL user database
DB_USER=user
# Pwd of your PostgreSQL user database
DB_PWD=pwd
# Port of your PostgreSQL database (5432 by default)
DB_PORT=5432
# Name of default team (team on / url)
DEFAULT_TEAM=default
```

### Front configuration - PROD ENVIRONMENT
2a - create ~/.env.production file for production environment and add this content :
```
# Url directory of your front app
PUBLIC_URL="/mood"
# Your domain name
REACT_APP_API_URL="https://domain.name"
# admin page code
REACT_APP_ADMIN_PWD="<your code>"

```
### Front configuration - DEV ENVIRONMENT
2b - create ~/.env.development file for development environment and add this content :
```
PUBLIC_URL="http://localhost:3000"
REACT_APP_API_URL="http://localhost:8400"
REACT_APP_ADMIN_PWD="admin"

```


## Run API & Front App
### Dev
1 - API Run
```bash
cd ~/moodmeter/api/
npm run dev
```

2 - Front Installation & Run
```bash
cd ~/moodmeter
npm run start
```

3 - Moodmeter App is alive on http://localhost:3000

### PROD
1 - API run with pm2
```bash
cd ~/moodmeter/api/
pm2 start server.js
```

2 - Front build
```bash
cd ~/moodmeter/
npm run build
```

3 - Configure Nginx for accessing to front built static files and restart nginx. Simple configuration entry example :
```nginx
  location / {
          alias /home/johndoe/moodometer/build;
  }
```

4 - Moodmeter App is alive on http://*domainName*/mood
