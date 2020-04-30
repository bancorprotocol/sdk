export const legacyConverters = {
    'converteraab': {
        smartToken: {
            'aaabbbaaabbb': 'AAABBB'
        },
        reserves: {
            'aaaaaaaaaaaa': 'AAA',
            'bbbbbbbbbbbb': 'BBB'
        }
    },
    'converteraac': {
        smartToken: {
            'aaacccaaaccc': 'AAACCC'
        },
        reserves: {
            'aaaaaaaaaaaa': 'AAA',
            'cccccccccccc': 'CCC'
        }
    }
};

const eosTable = {
    stat: {
        AAABBB: {aaabbbaaabbb: [{supply: '400000.0000 AAACCC', max_supply: '250000000.0000 AAACCC', issuer: 'converteraab'}]},
        AAACCC: {aaacccaaaccc: [{supply: '200000.0000 AAACCC', max_supply: '250000000.0000 AAACCC', issuer: 'converteraac'}]}
    },
    settings: {
        converteraab: {converteraab: [{fee: 1500}]},
        converteraac: {converteraac: [{fee: 2500}]}
    },
    reserves: {
        converteraab: {converteraab: [{contract: 'aaaaaaaaaaaa', currency: '0.0 AAA', ratio: 500000, p_enabled: 1}, {contract: 'bbbbbbbbbbbb', currency: '0.0 BBB', ratio: 500000, p_enabled: 1}]},
        converteraac: {converteraac: [{contract: 'aaaaaaaaaaaa', currency: '0.0 AAA', ratio: 500000, p_enabled: 1}, {contract: 'cccccccccccc', currency: '0.0 CCC', ratio: 500000, p_enabled: 1}]}
    },
    accounts: {
        converteraab: {
            aaaaaaaaaaaa: [{balance: '61730.2619 AAA'}],
            bbbbbbbbbbbb: [{balance: '81923.0163 CCC'}]
        },
        converteraac: {
            aaaaaaaaaaaa: [{balance: '5950.2395 AAA'}],
            cccccccccccc: [{balance: '35343.8280 CCC'}]
        }
    }
};

export async function jsonRpcGetTableRows(args) {
    return Promise.resolve({rows: eosTable[args.table][args.scope][args.code], more: false, next_key: ''});
}
