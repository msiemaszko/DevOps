FROM node:alpine

WORKDIR /opt/app

COPY ./package.json ./

# instalowanie pakietów
RUN yarn install

# kopiowanie pozostałych katalogów
COPY . .

# CMD node index.js
CMD ["node", "index.js"]
