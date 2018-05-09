'use strict';
const log  = require ('ololog').configure ({ locate: false });

const Exchanges = require ('./exchanges').Exchanges;
const Wallets = require('./wallets').Wallets;

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

exports.desiredPortfolioValue = 10000;

class Portfolio {
    constructor(exchangeService = new Exchanges(), wallets = new Wallets()) {
        this.portfolio = {};
        this.wallets = wallets;
        this.exchangeService = exchangeService;
        this.portfolioRecipeDict = this.fetchPortfolioRecipe();

        portfolioCurrencies.forEach((currency) => {
            this.portfolio[currency] = 0.0;
        });
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

    async loadPortfolio() {
        let balancesPerExchange = await this.exchangeService.fetchPositiveBalances();

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


