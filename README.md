# Bancor SDK v0.1 (beta)

Javascript API that provides utilities and access to the Bancor Network mainnet contracts across the different blockchains using a unified & simplified interface.

## Initialization

```js
const bancor = require('bancor-sdk');

await bancor.init({
    // optional, mandatory when interacting with the ethereum mainnet
    ethereumNodeEndpoint: '<ethereum node endpoint>',
    // optional, mandatory when interacting with the EOS mainnet
    eosNodeEndpoint: '<eos node endpoint>',
    // optional, can be used along with an ethereum ropsten endpoint to interact with the ropsten deployment of the contracts
    // the default value for the argument is the mainnet contract address 
    ethereumContractRegistryAddress: '<ethereum contract registry address>',
});
```

## Usage

Price discovery - used to get the conversion rate between any two tokens in the Bancor Network.
Note that the source token and the target token can reside on two different blockchains.
In addition, `amount` input format is a decimal big number (as opposed to wei) since the function is blockchain agnostic.

```js
// get the rate between DAI and ENJ
const sourceToken = {
    blockchainType: 'ethereum',
    blockchainId: '0x6B175474E89094C44Da98b954EedeAC495271d0F'
};
const targetToken = {
    blockchainType: 'ethereum',
    blockchainId: '0xF629cBd94d3791C9250152BD8dfBDF380E2a3B9c'
};
const rate = await bancor.getRate(sourceToken, targetToken, "1.0");

// output:
12.946537808892427162
```


Conversion path generation - used to generate a path that can then be used for on-chain conversions.
Note that the source token and the target token can reside on two different blockchains.

```js
// generate the path between ETH and BNT
const sourceToken = {
    blockchainType: 'ethereum',
    blockchainId: '0xc0829421C1d260BD3cB3E0F06cfE2D52db2cE315'
};
const targetToken = {
    blockchainType: 'ethereum',
    blockchainId: '0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C'
};
const path = await bancor.generatePath(sourceToken, targetToken);

// output:
{
	"paths": [{
		"type": "ethereum",
		"path": [
            "0xc0829421c1d260bd3cb3e0f06cfe2d52db2ce315",
            "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C",
            "0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c"
        ]
	}]
}
```

## Features

  * Price discovery
  * Conversion path generation
  * Full cross-chain support

## Collaborators

* **[Yudi Levi](https://github.com/yudilevi)**
* **[Omry Rozenfeld](https://github.com/omryr)**
