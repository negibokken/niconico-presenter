FROM node:10.9.0-alpine

MAINTAINER negibokken

WORKDIR /usr/src/app

COPY package.json yarn.lock tsconfig.json /usr/src/app/
COPY public/ /usr/src/app/public
COPY server.js /usr/src/app/
COPY utils/ /usr/src/app/utils
COPY src/ /usr/src/app/src

RUN yarn install --network-concurrency 1 \
    && yarn build

EXPOSE 3000
CMD node server.js