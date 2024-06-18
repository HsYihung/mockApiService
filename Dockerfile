FROM node:20.11-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 3000 3443

CMD ["node", "server.js"]