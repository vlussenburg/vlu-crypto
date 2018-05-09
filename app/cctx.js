'use strict';
const log  = require ('ololog').configure ({ locate: false });
require ('ansicolor').nice;
const ExchangeService = require ('./exchanges').Exchanges;
const Portfolio = require ('./portfolio').Portfolio;
const ccxt = require ('ccxt');

const largecap_pairs = [
'BTC/USD',
'ETH/USD',
'XRP/BTC',
'BCH/BTC',
'EOS/BTC',
'LTC/BTC',
'ADA/BTC',
'XLM/BTC',
'IOTA/BTC',
'NEO/BTC',
'XMR/BTC',
'TRX/BTC',
'DASH/BTC',
'XEM/BTC',
'BCD/BTC',
'BCX/BTC',
'ETC/BTC',
'VEN/BTC',
'QTUM/BTC',
'BTG/BTC'
];

const midcap_pairs = [
'USDT/BTC',
'OMG/BTC',
'BNB/BTC',
'ICX/BTC',
'BTMSTAR/BTC',
'LSK/BTC',
'ZEC/BTC',
'HT/BTC',
'XRB/BTC',
'BTCP/BTC',
'XVG/BTC',
'PPT/BTC',
'BCN/BTC',
'STEEM/BTC',
'WAN/BTC',
'BTS/BTC',
'SC/BTC',
'ZIL/BTC',
'DOGE/BTC',
'STRAT/BTC',
'ZRX/BTC',
'AE/BTC',
'DGD/BTC',
'WAVES/BTC',
'SNT/BTC',
'DCR/BTC',
'RHOC/BTC',
'REP/BTC',
'WTC/BTC',
'HSR/BTC',
];

const smallcap_pairs = [
'AION/BTC',
'ONT/BTC',
'GNT/BTC',
'LRC/BTC',
'BAT/BTC',
'IOST/BTC',
'KMD/BTC',
'ARDR/BTC',
'DGB/BTC',
'KCS/BTC',
'ARK/BTC',
'PIVX/BTC',
'DCN/BTC',
'DRGN/BTC',
'MITH/BTC',
'ELF/BTC',
'GAS/BTC',
'KNC/BTC',
'SUB/BTC',
'SYS/BTC',
'QASH/BTC',
'BQX/BTC',
'SBTC',
'FCT/BTC',
'UBTC',
'RDD/BTC',
'BNT/BTC',
'NAS/BTC',
'MONA/BTC',
'STORM/BTC',
'FUN/BTC',
'VERI/BTC',
'ELA/BTC',
'SALT/BTC',
'GXS/BTC',
'POWR/BTC',
'XZC/BTC',
'NXT/BTC',
'R/BTC',
'LINK/BTC',
'REQ/BTC',
'WC/BTC',
'GBYTE/BTC',
'PAY/BTC',
'MAID/BTC',
'NEBL/BTC',
'DIG/BTC',
'ETN/BTC',
'CND/BTC',
'PART/BTC',
];

(async function () {

    try { 

        //let balancesPerExchange = await new Exchanges().fetchPositiveBalances()
        //log ('balancesPerExchange', balancesPerExchange);

        const exchangeService = new ExchangeService();
        //await exchanges.loadMarkets();
        const portfolio = new Portfolio(exchangeService);
        portfolio.loadPortfolio().then((o) => {
            log ('loadPortfolio', o);
        })
        portfolio.loadDesiredPortfolio().then((o) => {
            log ('loadDesiredPortfolio', o);
        })


/*        largecap_pairs.forEach((pair) => {
            const exchangesWithPair = exchanges.findExchangesWithPair(pair);
            log ('findExchangesWithPair: ' + pair, exchangesWithPair.map(exchange => exchange.name));

            if (exchangesWithPair.length == 1) {
                log ('only one for: ' + pair, exchangesWithPair.map(exchange => exchange.name));                
            }

            if (exchangesWithPair.length == 0) {
                log ('zero for: ' + pair, exchangesWithPair.map(exchange => exchange.name));                
            }
        });  */      

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