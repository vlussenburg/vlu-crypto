'use strict';
const ccxt = require ('ccxt');
const log  = require ('ololog').configure ({ locate: false });
require ('ansicolor').nice;
const exchanges = require ('./exchanges');
const portfolio = require ('./portfolio');
const asTable = require ('as-table');

async function doStuff(exchanges) {
    for (let exchange of exchanges) {
            // fetch account balance from the exchange 
            //let balance = await exchange.fetchBalance ()
            let orders = await exchange.fetchMyTrades ()

            // output the result
            //log (exchange.name.green, 'balance', balance)
            log (asTable (orders.map (order => ccxt.omit (order, [ 'timestamp', 'info' ]))))
        }
}



(async function () {

    //console.log (kraken.id,    await kraken.loadMarkets ())

    try { 

        await doStuff(exchanges.exchanges);

        let order = await exchanges.gdax.createLimitBuyOrder ('BTC/USD', 1, 10)
        log(exchanges.gdax.name.green, 'order', order)
        await exchanges.gdax.cancelOrder(order['id'])


    } catch (e) {

        if (e instanceof ccxt.DDoSProtection || e.message.includes ('ECONNRESET')) {
            log.bright.yellow ('[DDoS Protection] ' + e.message)
        } else if (e instanceof ccxt.RequestTimeout) {
            log.bright.yellow ('[Request Timeout] ' + e.message)
        } else if (e instanceof ccxt.AuthenticationError) {
            log.bright.yellow ('[Authentication Error] ' + e.message)
        } else if (e instanceof ccxt.ExchangeNotAvailable) {
            log.bright.yellow ('[Exchange Not Available Error] ' + e.message)
        } else if (e instanceof ccxt.ExchangeError) {
            log.bright.yellow ('[Exchange Error] ' + e.message)
        } else if (e instanceof ccxt.NetworkError) {
            log.bright.yellow ('[Network Error] ' + e.message)
        } else {
            throw e;
        } 
    }   
}) ();