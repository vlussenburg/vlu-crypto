'use strict';
const ccxt = require ('ccxt');
const log  = require ('ololog').configure ({ locate: false });

let kraken = new ccxt.kraken ({
    apiKey: process.env.KRAKEN_APIKEY,
    secret:  process.env.KRAKEN_SECRET,
})

let gdax = new ccxt.gdax  ({ 
    apiKey: process.env.GDAX_APIKEY,
    secret:  process.env.GDAX_SECRET,
    password: process.env.GDAX_PASSWORD,
})

let hitbtc = new ccxt.hitbtc2 ({
    apiKey: process.env.HITBTC_APIKEY,
    secret:  process.env.HITBTC_SECRET,
})  

let binance = new ccxt.binance ({
    apiKey: process.env.BINANCE_APIKEY,
    secret:  process.env.BINANCE_SECRET,
    'options': { 'adjustForTimeDifference': true }
})

exports.exchanges = [hitbtc, kraken, gdax, binance];
exports.kraken = kraken;
exports.hitbtc = hitbtc;
exports.gdax = gdax;
exports.binance = binance;