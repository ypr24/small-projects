FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./

# Set proxy for npm
# RUN npm config set proxy http://192.168.49.1:8282
# RUN npm config set https-proxy http://192.168.49.1:8282


RUN npm install

COPY . .

EXPOSE 3000

CMD [ "node", "index.js" ]
