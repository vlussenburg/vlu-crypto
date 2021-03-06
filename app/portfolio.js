'use strict';
const Exchanges = require ('./exchanges').Exchanges;
const Wallets = require ('./wallets').Wallets;

const log  = require ('ololog').configure ({ locate: false });
const ccxt = require ('ccxt');

const portfolioRecipe =
`BTC,30.00%
ETH,29.44%
XRP,14.21%
BCH,9.56%
LTC,5.11%
EOS,2.82%
ADA,2.75%
NEO,2.41%
DASH,1.90%
TRX,1.80%`;

const portfolioCurrencies = [
'BTC',
'ETH',
'XRP',
'BCH',
'LTC',
'EOS',
'ADA',
'NEO',
'DASH',
'TRX'
];

class Portfolio {
    constructor(exchanges = new Exchanges(), wallets = new Wallets(), tickerExchange = new ccxt.coinmarketcap()) {
        this.portfolio = this.createBlankPortfolio();
        this.wallets = wallets;
        this.exchanges = exchanges;
        this.tickerExchange = tickerExchange;
        this.portfolioRecipeDict = this.fetchPortfolioRecipe();
        this.desiredPortfolio = {};
        this.desiredPortfolioValue = process.env.DESIRED_PORTFOLIO_VALUE;
        this.fiatPortfolioCurrency = process.env.DESIRED_PORTFOLIO_CURRENCY;
    }

    createBlankPortfolio() {
        const portfolio = {};
        portfolioCurrencies.forEach((currency) => {
            portfolio[currency] = 0.0;
        });
        return portfolio;
    }

    fetchPortfolioRecipe() {
        const portfolioRecipeDict = {};
        const portfolioLines = portfolioRecipe.split("\n");

        portfolioLines.forEach((lines) => {
            const currencyPercentagePair = lines.split(",");
            portfolioRecipeDict[currencyPercentagePair[0]] = (parseFloat(currencyPercentagePair[1]) / 100).toPrecision(4);
        });

        return portfolioRecipeDict;
    }

    getPortfolioRecipe() {
        return this.portfolioRecipeDict;
    };

    // TODO test me
    async loadDesiredPortfolio() {
        const tickers = await this.getTickers();
        portfolioCurrencies.forEach((currency) => {
            const ticker = tickers[this.getTradingPair(currency)];
            log('price', ticker.last, currency);
            this.desiredPortfolio[currency] = this.portfolioRecipeDict[currency] *  (this.desiredPortfolioValue / ticker.last);
        });
        return this.desiredPortfolio;
    }

    // under the assumption that the tickerExchange is faster returning all the tickers
    async getTickers() {
        return await this.tickerExchange.fetchTickers();
    }

    getTradingPair(currency) {
        return currency + '/' + this.fiatPortfolioCurrency;
    }

// TODO test me
    loadDeltas() {
        const deltas = {};
        Object.keys(this.portfolio).forEach((currency) =>
            deltas[currency] = this.portfolio[currency] - this.desiredPortfolio[currency]
        );
        return deltas;
    }


    async loadPortfolio() {
        let balancesPerExchange = await this.exchanges.fetchPositiveBalances();

        balancesPerExchange.forEach((balance) => {
            Object.keys(balance.free).forEach((currency) => {
                if (portfolioCurrencies.includes(currency)) {
                    this.portfolio[currency] += balance.free[currency];
                }
            });
        });

        const walletsBalances = this.wallets.getBalances();
        Object.keys(walletsBalances).forEach((currency) => {
            if (portfolioCurrencies.includes(currency)) {
                this.portfolio[currency] += walletsBalances[currency];
            }
        }); 

        return this.portfolio;
    }
}
exports.Portfolio = Portfolio;


