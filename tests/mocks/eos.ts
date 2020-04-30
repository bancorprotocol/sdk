export async function jsonRpcGetTableRows(eosTable, args) {
    return Promise.resolve({rows: eosTable[args.table][args.scope][args.code], more: false, next_key: ''});
};
