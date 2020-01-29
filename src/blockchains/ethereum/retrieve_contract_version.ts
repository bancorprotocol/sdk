const Web3 = require("web3");

async function rpc(func) {
    while (true) {
        try {
            return await func.call();
        }
        catch (error) {
            if (!error.message.startsWith("Invalid JSON RPC response"))
                return "";
        }
    }
}

function parse(type, data) {
    if (type.startsWith("bytes")) {
        const list = [];
        for (let i = 2; i < data.length; i += 2) {
            const num = Number("0x" + data.slice(i, i + 2));
            if (32 <= num && num <= 126)
                list.push(num);
            else
                break;
        }
        return String.fromCharCode(...list);
    }
    return data;
}

async function get(web3, contractAddress) {
    for (const type of ["string", "bytes32", "uint16"]) {
        const abi = [{"constant":true,"inputs":[],"name":"version","outputs":[{"name":"","type":type}],"payable":false,"stateMutability":"view","type":"function"}];
        const contract = new web3.eth.Contract(abi , contractAddress);
        const version = await rpc(contract.methods.version());
        const value = parse(type, version);
        if (value)
            return {type: type, value: value};
    }
    return {};
}

export async function run(nodeAddress, contractAddress) {
    const web3 = new Web3(nodeAddress);
    const version = get(web3, contractAddress);
    if (web3.currentProvider.constructor.name == "WebsocketProvider")
        web3.currentProvider.connection.close();
    return version;
}
