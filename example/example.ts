/* eslint-disable no-console */
import { init, getRate } from '../src';

const path = { // this is what a path object for eos rate looks like
    from: { // eos address uses token account and token symbol
        tokenAccount: 'eosdtsttoken',
        tokenSymbol: 'EOSDT'
    },
    to: {
        tokenAccount: 'everipediaiq',
        tokenSymbol: 'IQ'
    },
    toSmartToken: {
        tokenAccount: 'bancorr11123',
        tokenSymbol: 'BNTIQ'
    },
    fromSmartToken: {
        tokenAccount: 'bancorr11132',
        tokenSymbol: 'BNTOCT'
    },

    karmaWithFee: {
        tokenSymbol: 'KARMA',
        tokenAccount: 'therealkarma'
    },

    eos: {
        tokenAccount: 'eosio.token',
        tokenSymbol: 'EOS'
    }
};

export async function testConversionTypes() { // examples of how to use the library (can run it from outside)
    await init({ ethereumNodeEndpointUrl: 'https://mainnet.infura.io/v3/ec2c4801bcf44d9daa49f2e541851706', eosNodeEndpointUrl: 'https://eos.greymass.com:443' });
    // pass true to init if you want to regenerate the eos_paths file
    const srcToken: any = '0xc0829421c1d260bd3cb3e0f06cfe2d52db2ce315';
    // const trgToken: any = '0xd7eb9db184da9f099b84e2f86b1da1fe6b305b3d';
    const trgToken: any = '0xd26114cd6ee289accf82350c8d8487fedb8a0c07';

    const EOSToEth = await getRate({ eosBlockchainId: path.eos, blockchainType: 'eos' }, { ethereumBlockchainId: srcToken, blockchainType: 'ethereum' }, '1');
    console.log('EOSToEth ', EOSToEth);
    const EthToEos = await getRate({ ethereumBlockchainId: srcToken, blockchainType: 'ethereum' }, { eosBlockchainId: path.eos, blockchainType: 'eos' }, '1');
    console.log('EthToEos ', EthToEos);
    const EthTokenToEthToken = await getRate({ ethereumBlockchainId: srcToken, blockchainType: 'ethereum' }, { ethereumBlockchainId: trgToken, blockchainType: 'ethereum' }, '1');
    console.log('EthTokenToEthToken ', EthTokenToEthToken);
    const EosTokenToEosToken = await getRate({ eosBlockchainId: path.from, blockchainType: 'eos' }, { eosBlockchainId: path.to, blockchainType: 'eos' }, '123');
    console.log('EosTokenToEosToken ', EosTokenToEosToken);
    const EosTokenToEosSmartToken = await getRate({ eosBlockchainId: path.from, blockchainType: 'eos' }, { eosBlockchainId: path.toSmartToken, blockchainType: 'eos' }, '123');
    console.log('EosTokenToEosSmartToken ', EosTokenToEosSmartToken);
    const eosToEosWithFee = await getRate({ eosBlockchainId: path.from, blockchainType: 'eos' }, { eosBlockchainId: path.karmaWithFee, blockchainType: 'eos' }, '123');
    console.log('eosToEosWithFee ', eosToEosWithFee);
    const EosSmartTokenToEosToken = await getRate({ eosBlockchainId: path.fromSmartToken, blockchainType: 'eos' }, { eosBlockchainId: path.to, blockchainType: 'eos' }, '123');
    console.log('EosSmartTokenToEosToken ', EosSmartTokenToEosToken);
    const EosSmartTokenToEosSmartToken = await getRate({ eosBlockchainId: path.fromSmartToken, blockchainType: 'eos' }, { eosBlockchainId: path.toSmartToken, blockchainType: 'eos' }, '123');
    console.log('EosSmartTokenToEosSmartToken ', EosSmartTokenToEosSmartToken);
    const EthTokenToEosToken = await getRate({ ethereumBlockchainId: srcToken, blockchainType: 'ethereum' }, { eosBlockchainId: path.to, blockchainType: 'eos' }, '1');
    console.log('EthTokenToEosToken ', EthTokenToEosToken);
    const EosTokenToEthToken = await getRate({ eosBlockchainId: path.from, blockchainType: 'eos' }, { ethereumBlockchainId: trgToken, blockchainType: 'ethereum' }, '1');
    console.log('EosTokenToEthToken ', EosTokenToEthToken);
}
