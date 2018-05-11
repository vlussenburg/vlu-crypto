'use strict';
const ccxt = require ('ccxt');
const log  = require ('ololog').configure ({ locate: false });

const MINIMUM_BALANCE = 0.01;

const kraken = new ccxt.kraken ({
    apiKey: process.env.KRAKEN_APIKEY,
    secret:  process.env.KRAKEN_SECRET,
});

const gdax = new ccxt.gdax  ({
    apiKey: process.env.GDAX_APIKEY,
    secret:  process.env.GDAX_SECRET,
    password: process.env.GDAX_PASSWORD,
});

const hitbtc = new ccxt.hitbtc2 ({
    apiKey: process.env.HITBTC_APIKEY,
    secret:  process.env.HITBTC_SECRET,
});

const binance = new ccxt.binance ({
    apiKey: process.env.BINANCE_APIKEY,
    secret:  process.env.BINANCE_SECRET,
    'options': { 'adjustForTimeDifference': true }
});

const kucoin = new ccxt.kucoin({});

const bittrex = new ccxt.bittrex({});

const cryptopia = new ccxt.cryptopia({});

const bitfinex = new ccxt.bitfinex({});

const livecoin = new ccxt.livecoin({});

const okex = new ccxt.okex({});

class Exchanges {
    constructor(exchanges = [hitbtc, kraken, gdax, binance, kucoin, bittrex, cryptopia, bitfinex, livecoin, okex]) {
        this.exchanges = exchanges;
    }

    async fetchPositiveBalances() {
        const balancesPerExchangePromises = [];

        const exchangesWithApiKey = this.exchanges.filter(exchange => exchange.apiKey);
        for (let exchange of exchangesWithApiKey) {
            balancesPerExchangePromises.push(new Promise(async (resolve, reject) => {
                try {
                    const exchangeBalance = await exchange.fetchBalance();
                    const positiveBalances = {};
                    positiveBalances.name = exchange.name;
                    positiveBalances.free = {};

                    const currencies = Object.keys(exchangeBalance.free);
                    currencies.forEach((currency) => {
                        const freeBalanceRounded = exchangeBalance.free[currency].toPrecision(2);
                        if (freeBalanceRounded >= MINIMUM_BALANCE) {
                            positiveBalances.free[currency] = exchangeBalance.free[currency];
                        }
                    });
                    resolve(positiveBalances);
                } catch (e) {
                    reject(e);
                }

            }));
        }

        return Promise.all(balancesPerExchangePromises);
    }

    async loadMarkets() {
        await Promise.all(this.exchanges.map((exchange) => exchange.loadMarkets()));
    }

    // UNTESTED, such a shallow wrapper around library code
    withPair(pair) {
        return new Exchanges(this.exchanges.filter(exchange => (exchange.markets[pair])));
    }

    async withBalance(currency, amount) {
        const positiveBalances = await this.fetchPositiveBalances();
        const balancesWithTheCurrencyAmount = positiveBalances.filter((exchangeBalance) => exchangeBalance.free[currency] >= amount);

        const exchangesWithEnoughBalance = this.exchanges.filter(exchange => {
            return balancesWithTheCurrencyAmount.find((exchangeBalance) => exchangeBalance.name === exchange.name);
        });
        return new Exchanges(exchangesWithEnoughBalance);
    }

    getPreferred() {
        // very advanced algorithm
        return this.exchanges[0];
    }

}

exports.Exchanges = Exchanges;

