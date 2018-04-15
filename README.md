
# Roadmap

- Red button to mass-market-sell going to other total amount
- Green button to mass-market-buy going to other total amount
- Orange button to mass-limit order to hedge
- Something with hedging anyways
- Something to measure effectiveness (fees, etc)

# Usage

## Create a env.list 

In the root with keys to the exchanges

````
KRAKEN_APIKEY=
KRAKEN_SECRET=
GDAX_APIKEY=
GDAX_SECRET=
GDAX_PASSWORD=
HITBTC_APIKEY=
HITBTC_SECRET=
BINANCE_APIKEY=
BINANCE_SECRET=
````

## Run

`docker build -t vl-crypto:latest . && docker run -ti -v `pwd`/app/:/opt/vl-crypto/app --env-file ./env.list vl-crypto:latest`

# Links

- (ledger)[https://github.com/0xProject/ledger-node-js-api]