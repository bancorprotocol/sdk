"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-console */
var src_1 = require("../src");
var path = {
    from: {
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
function testConversionTypes() {
    return __awaiter(this, void 0, void 0, function () {
        var srcToken, trgToken, EOSToEth, EthToEos, EthTokenToEthToken, EosTokenToEosToken, EosTokenToEosSmartToken, eosToEosWithFee, EosSmartTokenToEosToken, EosSmartTokenToEosSmartToken, EthTokenToEosToken, EosTokenToEthToken;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: // examples of how to use the library (can run it from outside)
                return [4 /*yield*/, src_1.init({ ethereumNodeEndpointUrl: 'https://mainnet.infura.io/v3/ec2c4801bcf44d9daa49f2e541851706', eosNodeEndpointUrl: 'https://eos.greymass.com:443' })];
                case 1:
                    _a.sent();
                    srcToken = '0xc0829421c1d260bd3cb3e0f06cfe2d52db2ce315';
                    trgToken = '0xd26114cd6ee289accf82350c8d8487fedb8a0c07';
                    return [4 /*yield*/, src_1.getRate({ eosBlockchainId: path.eos, blockchainType: 'eos' }, { ethereumBlockchainId: srcToken, blockchainType: 'ethereum' }, '1')];
                case 2:
                    EOSToEth = _a.sent();
                    console.log('EOSToEth ', EOSToEth);
                    return [4 /*yield*/, src_1.getRate({ ethereumBlockchainId: srcToken, blockchainType: 'ethereum' }, { eosBlockchainId: path.eos, blockchainType: 'eos' }, '1')];
                case 3:
                    EthToEos = _a.sent();
                    console.log('EthToEos ', EthToEos);
                    return [4 /*yield*/, src_1.getRate({ ethereumBlockchainId: srcToken, blockchainType: 'ethereum' }, { ethereumBlockchainId: trgToken, blockchainType: 'ethereum' }, '1')];
                case 4:
                    EthTokenToEthToken = _a.sent();
                    console.log('EthTokenToEthToken ', EthTokenToEthToken);
                    return [4 /*yield*/, src_1.getRate({ eosBlockchainId: path.from, blockchainType: 'eos' }, { eosBlockchainId: path.to, blockchainType: 'eos' }, '123')];
                case 5:
                    EosTokenToEosToken = _a.sent();
                    console.log('EosTokenToEosToken ', EosTokenToEosToken);
                    return [4 /*yield*/, src_1.getRate({ eosBlockchainId: path.from, blockchainType: 'eos' }, { eosBlockchainId: path.toSmartToken, blockchainType: 'eos' }, '123')];
                case 6:
                    EosTokenToEosSmartToken = _a.sent();
                    console.log('EosTokenToEosSmartToken ', EosTokenToEosSmartToken);
                    return [4 /*yield*/, src_1.getRate({ eosBlockchainId: path.from, blockchainType: 'eos' }, { eosBlockchainId: path.karmaWithFee, blockchainType: 'eos' }, '123')];
                case 7:
                    eosToEosWithFee = _a.sent();
                    console.log('eosToEosWithFee ', eosToEosWithFee);
                    return [4 /*yield*/, src_1.getRate({ eosBlockchainId: path.fromSmartToken, blockchainType: 'eos' }, { eosBlockchainId: path.to, blockchainType: 'eos' }, '123')];
                case 8:
                    EosSmartTokenToEosToken = _a.sent();
                    console.log('EosSmartTokenToEosToken ', EosSmartTokenToEosToken);
                    return [4 /*yield*/, src_1.getRate({ eosBlockchainId: path.fromSmartToken, blockchainType: 'eos' }, { eosBlockchainId: path.toSmartToken, blockchainType: 'eos' }, '123')];
                case 9:
                    EosSmartTokenToEosSmartToken = _a.sent();
                    console.log('EosSmartTokenToEosSmartToken ', EosSmartTokenToEosSmartToken);
                    return [4 /*yield*/, src_1.getRate({ ethereumBlockchainId: srcToken, blockchainType: 'ethereum' }, { eosBlockchainId: path.to, blockchainType: 'eos' }, '1')];
                case 10:
                    EthTokenToEosToken = _a.sent();
                    console.log('EthTokenToEosToken ', EthTokenToEosToken);
                    return [4 /*yield*/, src_1.getRate({ eosBlockchainId: path.from, blockchainType: 'eos' }, { ethereumBlockchainId: trgToken, blockchainType: 'ethereum' }, '1')];
                case 11:
                    EosTokenToEthToken = _a.sent();
                    console.log('EosTokenToEthToken ', EosTokenToEthToken);
                    return [2 /*return*/];
            }
        });
    });
}
exports.testConversionTypes = testConversionTypes;
