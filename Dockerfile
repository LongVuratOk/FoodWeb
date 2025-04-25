FROM node:22

WORKDIR /app

COPY . .

RUN npm i

CMD ["node", "server.js"]