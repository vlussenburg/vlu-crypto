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

            assert.equal(balances.length, Object.keys(exchangeToAmountMap).length)
            balances.forEach((exchangeBalance) => {
                assert.equal(exchangeBalance.free['BTC'], exchangeToAmountMap[exchangeBalance.name]);
            })
        });

        it('should filter out (close-to-)zero balances and leave positive balances', async() => {
            const exchange = new DummyExchange({});
            exchange.name = 'a';
            exchange.fetchBalance = async function () {
                return { 'free': { 'BTC': 0.0099, 'XXX': 0, 'ABC': 99.8 } };
            }

            exchangeService = new ExchangeService([exchange]);
            const balances = await exchangeService.fetchPositiveBalances();

            assert.equal(balances.length, 1);
            assert.equal(balances[0].name, 'a');
            assert.equal(Object.keys(balances[0].free).length, 1);
            assert.equal(balances[0].free['ABC'], 99.8);
        });
    });

});