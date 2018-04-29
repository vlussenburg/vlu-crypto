'use strict';
const assert = require('assert');
const sinon = require('sinon');
const Portfolio = require ('../app/portfolio').Portfolio;

describe('portofolio', function() {
  
    describe('#getPortfolioRecipe()', function() {
        it('should return each currency percentage pair', async() => {
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

});
