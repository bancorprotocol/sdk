export const ContractRegistry = [
    {"constant":true,"inputs":[{"name":"_contractName","type":"bytes32"}],"name":"addressOf","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"}
];

export const BancorNetwork = [
    {"constant":true,"inputs":[{"name":"_path","type":"address[]"},{"name":"_amount","type":"uint256"}],"name":"getReturnByPath","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}
];

export const BancorConverterRegistry = [
    {"constant":true,"inputs":[],"name":"getConvertibleTokens","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},
    {"constant":true,"inputs":[{"name":"_convertibleToken","type":"address"}],"name":"getConvertibleTokenSmartTokens","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"}
];

export const ERC20Token = [
    {"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"}
];

export const MulticallContract = [
    {"constant":false,"inputs":[{"components":[{"internalType":"address","name":"target","type":"address"},{"internalType":"bytes","name":"callData","type":"bytes"}],"internalType":"struct Multicall.Call[]","name":"calls","type":"tuple[]"},{"internalType":"bool","name":"strict","type":"bool"}],"name":"aggregate","outputs":[{"internalType":"uint256","name":"blockNumber","type":"uint256"},{"components":[{"internalType":"bool","name":"success","type":"bool"},{"internalType":"bytes","name":"data","type":"bytes"}],"internalType":"struct Multicall.Return[]","name":"returnData","type":"tuple[]"}],"payable":false,"stateMutability":"nonpayable","type":"function"}
];
