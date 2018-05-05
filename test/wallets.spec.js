'use strict';
const assert = require('assert');
const sinon = require('sinon');
const Wallets = require ('../app/wallets').Wallets;

describe('Wallets', function() {
  
    describe('#getBalances()', function() {
        it('should return currency balance', function() {
            process.env.LEDGER_EOS=1
            process.env.SAIFU_BCH=2
            process.env.LEDGER_NEO=3

            const balances = new Wallets({}).getBalances();

            assert.deepEqual(Object.keys(balances), ['EOS', 'NEO', 'BCH']);
            assert.equal(balances['NEO'], 3);
            assert.equal(balances['BCH'], 2);
            assert.equal(balances['EOS'], 1);
        });
    });

});
