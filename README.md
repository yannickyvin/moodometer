# sushimeter - a team mood tracker (inspired by slavagu/moodometer)

A simple app to capture team mood and see how it changes over time.

Differences between this moodmeter and original project :
> Anonymous vote with uniq ID generation attached to navigator (local storage used => https necessary on recent navigators)

> Add Emoji icons and some functional improvements

> Change API and DB structure (switched DynamoDB to PostgreSQL DB and project is no more serverless)

# Installation

## Install DB and configure
1 - Create Database mood on postgreSQL DB then create mood table (./api/mood.sql)

2 - API Configuration :  ./api/config/config.js

## DEV Installation and Run
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

## PROD Installation (example)
1 - pm2 install. Cf https://www.npmjs.com/package/pm2

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

4 - Configure Nginx and restart. Config example :
```nginx
  location / {
          alias /home/toto/moodometer/build;
  }
```
