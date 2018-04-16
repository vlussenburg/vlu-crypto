'use strict';
const assert = require('assert');
const sinon = require('sinon');
const ExchangeService = require ('../app/exchanges').ExchangeService;
const ccxt = require ('ccxt');

describe('exchanges', function() {
    const exchangeToAmountMap = {
        'a': 1.0,
        'b': 2.0,
        'c': 3.0,
        'd': 4.0
    }

    const DummyExchange = class DummyExchange extends ccxt.Exchange {
        async fetchBalance (params = {}) {
            return { 'free': { 'BTC': exchangeToAmountMap[this.name] } };
        }
    };

    let exchangeService;
    beforeEach(function() {
        let exchanges = [];
        Object.keys(exchangeToAmountMap).forEach((exchangeName) => {
            const exchange = new DummyExchange({});
            exchange.name = exchangeName;       
            exchanges.push(exchange);
        });

        exchangeService = new ExchangeService(exchanges);
    });
  
    describe('#fetchPositiveBalances()', function() {
        it('should report the positive balance exactly once per exchange', async() => {
            const balances = await exchangeService.fetchPositiveBalances();
            const exchangeNames = Object.keys(balances);

            assert.equal(exchangeNames.length, Object.keys(exchangeToAmountMap).length)
            exchangeNames.forEach((exchangeName) => {
                const balance = balances[exchangeName]
                assert.equal(balance['BTC'], exchangeToAmountMap[exchangeName]);
            })
        });

        it('should filter out (close-to-)zero amounts', async() => {
            const exchange = new DummyExchange({});
            exchange.name = 'a';
            exchange.fetchBalance = async function () {
                return { 'free': { 'BTC': 0.01, 'XXX': 0 } };
            }

            exchangeService = new ExchangeService([exchange]);
            const balances = await exchangeService.fetchPositiveBalances();

            assert.equal(Object.keys(balances).length, 1)
            assert.equal(Object.keys(balances['a']).length, 0)
        });
    });

});