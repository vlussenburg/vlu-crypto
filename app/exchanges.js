'use strict';
const ccxt = require ('ccxt');
const log  = require ('ololog').configure ({ locate: false });
const asTable = require ('as-table');

const MINIMUM_BALANCE = 0.01

const kraken = new ccxt.kraken ({
    apiKey: process.env.KRAKEN_APIKEY,
    secret:  process.env.KRAKEN_SECRET,
})
exports.kraken = kraken;

const gdax = new ccxt.gdax  ({
    apiKey: process.env.GDAX_APIKEY,
    secret:  process.env.GDAX_SECRET,
    password: process.env.GDAX_PASSWORD,
})
exports.gdax = gdax;

const hitbtc = new ccxt.hitbtc2 ({
    apiKey: process.env.HITBTC_APIKEY,
    secret:  process.env.HITBTC_SECRET,
})  
exports.hitbtc = hitbtc;

const binance = new ccxt.binance ({
    apiKey: process.env.BINANCE_APIKEY,
    secret:  process.env.BINANCE_SECRET,
    'options': { 'adjustForTimeDifference': true }
})
exports.binance = binance;

let exchanges = [hitbtc, kraken, gdax, binance];
//exchanges = [kraken]

exports.exchanges = exchanges;


async function doStuff() {
    const balancesPerExchange = {}
    for (let exchange of exchanges) {
            balancesPerExchange[exchange.name] = {}
            const exchangeBalance = await exchange.fetchBalance ()

            const currencies = Object.keys (exchangeBalance.free)
            currencies.forEach((currency) => {
                const freeBalanceRounded = exchangeBalance.free[currency].toPrecision(2)
                if (freeBalanceRounded > MINIMUM_BALANCE) {
                    balancesPerExchange[exchange.name][currency] = exchangeBalance.free[currency]
                }
            })
    }
    // output the result
    log ('balancesPerExchange', balancesPerExchange)
}

exports.doStuff = doStuff