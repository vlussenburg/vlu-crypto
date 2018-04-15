FROM node:9.11.1-alpine

WORKDIR /opt/vl-crypto/

RUN npm install ccxt ololog	mocha

COPY app/ app/

CMD [ "node", "./app/cctx.js" ]
