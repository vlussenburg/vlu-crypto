'use strict';
const log  = require ('ololog').configure ({ locate: false });

class Wallets {
	constructor() {
    }

    getBalances() {
    	return {
    		'EOS': parseFloat(process.env.LEDGER_EOS),
    		'NEO': parseFloat(process.env.LEDGER_NEO),
            'ETH': parseFloat(process.env.LEDGER_ETH),
            'BCH': parseFloat(process.env.SAIFU_BCH),
    	};
    }

}

exports.Wallets = Wallets;