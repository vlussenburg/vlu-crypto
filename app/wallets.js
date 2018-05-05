'use strict';
const log  = require ('ololog').configure ({ locate: false });

class Wallets {
	constructor() {
    }

    getBalances() {
    	return {
    		'EOS': process.env.LEDGER_EOS,
    		'NEO': process.env.LEDGER_NEO,
    		'BCH': process.env.SAIFU_BCH,
    	};
    }

}

exports.Wallets = Wallets;