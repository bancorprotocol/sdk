# Bancor SDK v0.2 (beta)

Javascript API that provides utilities and access to the Bancor Network mainnet contracts across the different blockchains using a unified & simplified interface.

## Initialization

```js
const BancorSDK = require('bancor-sdk').SDK;

const settings = {
    // optional, mandatory when interacting with the ethereum mainnet
    ethereumNodeEndpoint: '<ethereum node endpoint>',
    // optional, mandatory when interacting with the EOS mainnet
    eosNodeEndpoint: '<eos node endpoint>'
};

let bancorSDK = await BancorSDK.create(settings);
```

## Usage

`getPathAndRate` - returns the best conversion path and rate between any two tokens in the Bancor Network.
Note that the source token and the target token can reside on two different blockchains.
In addition, input/output amounts format is a decimal string (as opposed to wei) since the function is blockchain agnostic.

```js
// get the path/rate between DAI and ENJ
const sourceToken = {
    blockchainType: 'ethereum',
    blockchainId: '0x6B175474E89094C44Da98b954EedeAC495271d0F'
};
const targetToken = {
    blockchainType: 'ethereum',
    blockchainId: '0xF629cBd94d3791C9250152BD8dfBDF380E2a3B9c'
};
const res = await bancorSDK.pricing.getPathAndRate(sourceToken, targetToken, "1.0");

// output:
{
    path: [
        { blockchainType: 'ethereum', blockchainId: '0x6B175474E89094C44Da98b954EedeAC495271d0F' },
        { blockchainType: 'ethereum', blockchainId: '0xcb913ED43e43cc7Cec1D77243bA381615101E7E4' },
        { blockchainType: 'ethereum', blockchainId: '0x309627af60F0926daa6041B8279484312f2bf060' },
        { blockchainType: 'ethereum', blockchainId: '0xd1146B08e8104EeDBa44a73B7bda1d102c6ceDC9' },
        { blockchainType: 'ethereum', blockchainId: '0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C' },
        { blockchainType: 'ethereum', blockchainId: '0xf3aD2cBc4276eb4B0fb627Af0059CfcE094E20a1' },
        { blockchainType: 'ethereum', blockchainId: '0xF629cBd94d3791C9250152BD8dfBDF380E2a3B9c' } 
    ],
    rate: '7.640578979520041176'
}

```

## Cleanup

```js
await BancorSDK.destroy(bancorSDK);
```

## Features

  * Price discovery
  * Conversion path generation
  * Historical data
  * Utilities
  * Cross-chain support

## Collaborators

* **[Yudi Levi](https://github.com/yudilevi)**
* **[Barak Manos](https://github.com/barakman)**
* **[Omry Rozenfeld](https://github.com/omryr)**
