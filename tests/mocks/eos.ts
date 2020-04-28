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

export async function jsonRpcGetTableRows(args) {
    if (args.code == 'aaabbbaaabbb' && args.scope == 'AAABBB' && args.table == 'stat') {
        return Promise.resolve({
            rows: [
                {
                    supply: '400000.0000 AAACCC',
                    max_supply: '250000000.0000 AAACCC',
                    issuer: 'converteraab'
                }
            ],
            more: false,
            next_key: ''
        })
    }
    else if (args.code == 'aaacccaaaccc' && args.scope == 'AAACCC' && args.table == 'stat') {
        return Promise.resolve({
            rows: [
                {
                    supply: '200000.0000 AAACCC',
                    max_supply: '250000000.0000 AAACCC',
                    issuer: 'converteraac'
                }
            ],
            more: false,
            next_key: ''
        })
    }
    else if (args.code == 'converteraab' && args.scope == 'converteraab' && args.table == 'settings') {
        return Promise.resolve({
            rows: [{ fee: 1500 }],
            more: false,
            next_key: ''
        })
    }
    else if (args.code == 'converteraac' && args.scope == 'converteraac' && args.table == 'settings') {
        return Promise.resolve({
            rows: [{ fee: 2500 }],
            more: false,
            next_key: ''
        })
    }
    else if (args.code == 'converteraab' && args.scope == 'converteraab' && args.table == 'reserves') {
        return Promise.resolve({
            rows: [
                {
                    contract: 'aaaaaaaaaaaa',
                    currency: '0.0 AAA',
                    ratio: 500000,
                    p_enabled: 1
                },
                {
                    contract: 'bbbbbbbbbbbb',
                    currency: '0.0 BBB',
                    ratio: 500000,
                    p_enabled: 1
                }
            ],
            more: false,
            next_key: ''
        })
    }
    else if (args.code == 'converteraac' && args.scope == 'converteraac' && args.table == 'reserves') {
        return Promise.resolve({
            rows: [
                {
                    contract: 'aaaaaaaaaaaa',
                    currency: '0.0 AAA',
                    ratio: 500000,
                    p_enabled: 1
                },
                {
                    contract: 'cccccccccccc',
                    currency: '0.0 CCC',
                    ratio: 500000,
                    p_enabled: 1
                }
            ],
            more: false,
            next_key: ''
        })
    }
    else if (args.code == 'aaaaaaaaaaaa' && args.scope == 'converteraab' && args.table == 'accounts') {
        return Promise.resolve({
            rows: [{ balance: '61730.2619 AAA' }],
            more: false,
            next_key: ''
        })
    }
    else if (args.code == 'bbbbbbbbbbbb' && args.scope == 'converteraab' && args.table == 'accounts') {
        return Promise.resolve({
            rows: [{ balance: '81923.0163 CCC' }],
            more: false,
            next_key: ''
        })
    }
    else if (args.code == 'aaaaaaaaaaaa' && args.scope == 'converteraac' && args.table == 'accounts') {
        return Promise.resolve({
            rows: [{ balance: '5950.2395 AAA' }],
            more: false,
            next_key: ''
        })
    }
    else if (args.code == 'cccccccccccc' && args.scope == 'converteraac' && args.table == 'accounts') {
        return Promise.resolve({
            rows: [{ balance: '35343.8280 CCC' }],
            more: false,
            next_key: ''
        })
    }
}
