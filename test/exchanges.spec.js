'use strict';
const assert = require('assert');
const sinon = require('sinon');
const Exchanges = require ('../app/exchanges').Exchanges;
const ccxt = require ('ccxt');

describe('exchanges', function() {
    const exchangeToAmountMap = {
        'exchange-a': 1.0,
        'exchange-b': 2.0,
        'exchange-c': 3.0,
        'exchange-d': 4.0
    };

    const DummyExchange = class DummyExchange extends ccxt.Exchange {
        constructor () {
            super();
            this.apiKey = '123';
        }
        async fetchBalance (params = {}) {
            return { 'free': { 'BTC': exchangeToAmountMap[this.name] } };
        }
    };

    let exchanges;
    beforeEach(function() {
        exchanges = [];
        Object.keys(exchangeToAmountMap).forEach((exchangeName) => {
            const exchange = new DummyExchange({});
            exchange.name = exchangeName;
            exchanges.push(exchange);
        });

        exchanges = new Exchanges(exchanges);
    });
  
    describe('#fetchPositiveBalances()', function() {
        it('should report the positive balance exactly once per exchange', async() => {
            const balances = await exchanges.fetchPositiveBalances();

            assert.equal(balances.length, Object.keys(exchangeToAmountMap).length);
            balances.forEach((exchangeBalance) => {
                assert.equal(exchangeBalance.free['BTC'], exchangeToAmountMap[exchangeBalance.name]);
            })
        });

        it('should filter out (close-to-)zero balances and leave positive balances', async() => {
            const exchange = new DummyExchange({});
            exchange.name = 'a';
            exchange.fetchBalance = async() => {
                return { 'free': { 'BTC': 0.0099, 'XXX': 0, 'ABC': 99.8 } };
            };

            exchanges = new Exchanges([exchange]);
            const balances = await exchanges.fetchPositiveBalances();

            assert.equal(balances.length, 1);
            assert.equal(balances[0].name, 'a');
            assert.equal(Object.keys(balances[0].free).length, 1);
            assert.equal(balances[0].free['ABC'], 99.8);
        });
    });

    describe('#withBalance()', function() {
        it('should find the exchanges with enough balance', async() => {
            const exchangesWith4Btc = await exchanges.withBalance("BTC", 2.8);

            assert.equal(exchangesWith4Btc.exchanges.length, 2);
            assert.equal(exchangesWith4Btc.exchanges[0].name, "exchange-c");
            assert.equal(exchangesWith4Btc.exchanges[1].name, "exchange-d");
        });
    });


});