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

/!\ Using navigator local storage (recording an uniq id) => in production environnement https domain is necessary for a functionnal app. 
You can install a free let's encrypt certificate : https://letsencrypt.org/

## Get Moodometer Sources
git clone https://github.com/yannickyvin/moodometer.git
or
git clone git@github.com:yannickyvin/moodometer.git

## Install MoodDB and create mood table
1 - Create mood Database on postgreSQL with user/pwd of your choice

2 - Create mood table from sql script : ./api/mood.sql

## Set API & Front Configuration 

### API Configuration
1 - create ./api/.env file and add this content (replace values in italic) :
```
NODE_ENV=*development*
DB_HOST=*hostname*
DB_DATABASENAME=*mood*
DB_USER=*user*
DB_PWD=*pwd*
DB_PORT=*5432*
DEFAULT_TEAM=*name of default team (aka team displayed on / url)*
```

### Front configuration - PROD ENVIRONMENT
2a - create ~/.env.production file for production environment and add this content :
```
PUBLIC_URL="*/mood*"
REACT_APP_API_URL="*https://domain.name*"

```
### Front configuration - DEV ENVIRONMENT
2b - create ~/.env.development file for development environment and add this content :
```
PUBLIC_URL="http://localhost:3000"
REACT_APP_API_URL="http://localhost:8400"

```


## Install Front App and Run
### Dev
1 - API Installation & Run
```bash
cd ~/moodmeter/api/
npm install
npm run dev
```

2 - Front Installation & Run
```bash
cd ~/moodmeter
npm install
npm run start
```

### PROD
1 - pm2 install.
```bash
npm install pm2 -g
```
Cf https://www.npmjs.com/package/pm2

2 - API run with pm2
```bash
cd ~/moodmeter/api/
pm2 start server.js
```

3 - Front build
```bash
cd ~/moodmeter/
npm run build
```

4 - Configure Nginx and restart nginx. Simple configuration example :
```nginx
  location / {
          alias /home/johndoe/moodometer/build;
  }
```
