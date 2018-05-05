'use strict';
const assert = require('assert');
const sinon = require('sinon');
const Portfolio = require ('../app/portfolio').Portfolio;

describe('portofolio', function() {
  
    describe('#getPortfolioRecipe()', function() {
        it('should return each currency percentage pair', function() {
            const portfolioRecipe = new Portfolio().getPortfolioRecipe();

            assert.equal(Object.keys(portfolioRecipe).length, 10);
            assert.equal(portfolioRecipe['BTC'], 0.3);
            assert.equal(portfolioRecipe['ETH'], 0.2944);
            assert.equal(portfolioRecipe['XRP'], 0.1421);
            assert.equal(portfolioRecipe['BCH'], 0.0956);
            assert.equal(portfolioRecipe['LTC'], 0.0511);
            assert.equal(portfolioRecipe['EOS'], 0.0282);
            assert.equal(portfolioRecipe['ADA'], 0.0275);
            assert.equal(portfolioRecipe['NEO'], 0.0241);
            assert.equal(portfolioRecipe['DASH'], 0.0190);
            assert.equal(portfolioRecipe['TRX'], 0.0180);
        });
    });

    describe('#loadPortfolio()', function() {
                it('should initialize all currencies with zero', async() => {
            const portfolio = await new Portfolio({
                fetchPositiveBalances: function() { return [ ] } //exchangeService
            }).loadPortfolio();

            assert.equal(Object.keys(portfolio).length, 10);
            assert.equal(portfolio['BTC'], 0.0);
            assert.equal(portfolio['TRX'], 0.0);
        });

        it('should do add totals from exchange', async() => {
            const portfolio = await new Portfolio({
                fetchPositiveBalances: function() { //exchangeService
                    return [ 
                        { 'name': 'dummyExchange1', 'free': {'BTC': 1} },
                        { 'name': 'dummyExchange2', 'free': {'BTC': 1} }
                    ] }
            }).loadPortfolio();

            assert.equal(portfolio['BTC'], 2);
            assert.equal(portfolio['TRX'], 0);
        });

        it('should ignore unknown currencies from exchange', async() => {
            const portfolio = await new Portfolio({
                fetchPositiveBalances: function() { //exchangeService
                    return [ 
                        { 'name': 'dummyExchange', 'free': {'XXX': 1} }
                    ] }
            }).loadPortfolio();

            assert.equal(portfolio['XXX'], undefined);
        });

        it('should add balances from wallets', async() => {
            const portfolio = await new Portfolio({ //exchangeService
                fetchPositiveBalances: function() {
                    return [ 
                        { 'name': 'dummyExchange', 'free': {'BTC': 1} }
                    ] }
            }, { //wallets
                getBalances: function () { return {'BTC': 1, 'BCH': 2}}
            }).loadPortfolio();

            assert.equal(portfolio['BTC'], 2);
            assert.equal(portfolio['BCH'], 2);

        })
    });

});
