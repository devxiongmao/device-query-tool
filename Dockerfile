FROM node:22-alpine

WORKDIR /usr/src/app/

COPY public/ /usr/src/app/public
COPY src/ /usr/src/app/src
COPY package.json /usr/src/app/

RUN npm install

CMD ["npm", "start"]