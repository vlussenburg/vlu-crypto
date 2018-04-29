'use strict';
const assert = require('assert');
const sinon = require('sinon');
const Portfolio = require ('../app/portfolio').Portfolio;

describe('portofolio', function() {
  
    describe('#getPortfolioRecipe()', function() {
        it('should return each currency percentage pair', function() {
            const portfolioRecipe = new Portfolio({}).getPortfolioRecipe();

            assert.equal(Object.keys(portfolioRecipe).length, 10);
            assert.equal(portfolioRecipe['BTC'], 30.00);
            assert.equal(portfolioRecipe['ETH'], 29.44);
            assert.equal(portfolioRecipe['XRP'], 14.21);
            assert.equal(portfolioRecipe['BCH'], 9.56);
            assert.equal(portfolioRecipe['LTC'], 5.11);
            assert.equal(portfolioRecipe['EOS'], 2.82);
            assert.equal(portfolioRecipe['ADA'], 2.75);
            assert.equal(portfolioRecipe['NEO'], 2.41);
            assert.equal(portfolioRecipe['DASH'], 1.90);
            assert.equal(portfolioRecipe['TRX'], 1.80);
        });
    });

    describe('#loadPortfolio()', function() {
                it('should initialize all currencies with zero', async() => {
            const portfolio = await new Portfolio({
                fetchPositiveBalances: function() { return [ ] }
            }).loadPortfolio();

            assert.equal(Object.keys(portfolio).length, 10);
            assert.equal(portfolio['BTC'], 0.0);
            assert.equal(portfolio['TRX'], 0.0);
        });

        it('should do add totals from exchange', async() => {
            const portfolio = await new Portfolio({
                fetchPositiveBalances: function() {
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
                fetchPositiveBalances: function() {
                    return [ 
                        { 'name': 'dummyExchange', 'free': {'XXX': 1} }
                    ] }
            }).loadPortfolio();

            assert.equal(portfolio['XXX'], undefined);
        });
    });

});
