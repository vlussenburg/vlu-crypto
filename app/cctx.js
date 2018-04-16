'use strict';
const log  = require ('ololog').configure ({ locate: false });
require ('ansicolor').nice;
const ExchangeService = require ('./exchanges').ExchangeService;
const portfolio = require ('./portfolio');
const ccxt = require ('ccxt');

(async function () {

    //console.log (kraken.id,    await kraken.loadMarkets ())

    try { 

        new ExchangeService().fetchPositiveBalances()
        .then((balancesPerExchange) => {
            log ('balancesPerExchange', balancesPerExchange);
        })
        .catch((error) => {
            console.log(error);
        })
        

        //let order = await exchanges.gdax.createLimitBuyOrder ('BTC/USD', 1, 10)
        //log(exchanges.gdax.name.green, 'order', order)
        //await exchanges.gdax.cancelOrder(order['id'])


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