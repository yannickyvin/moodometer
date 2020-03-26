FROM node:12
WORKDIR /api
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8400
CMD npm run start
