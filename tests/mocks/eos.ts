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

export async function jsonRpcGetTableRows(eosTable, args) {
    return Promise.resolve({rows: eosTable[args.table][args.scope][args.code], more: false, next_key: ''});
};
