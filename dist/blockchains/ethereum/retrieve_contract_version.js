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
var Web3 = require("web3");
function rpc(func) {
    return __awaiter(this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!true) return [3 /*break*/, 5];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, func.call()];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    error_1 = _a.sent();
                    if (!error_1.message.startsWith("Invalid JSON RPC response"))
                        return [2 /*return*/, ""];
                    return [3 /*break*/, 4];
                case 4: return [3 /*break*/, 0];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function parse(type, data) {
    if (type.startsWith("bytes")) {
        var list = [];
        for (var i = 2; i < data.length; i += 2) {
            var num = Number("0x" + data.slice(i, i + 2));
            if (32 <= num && num <= 126)
                list.push(num);
            else
                break;
        }
        return String.fromCharCode.apply(String, list);
    }
    return data;
}
function get(web3, contractAddress) {
    return __awaiter(this, void 0, void 0, function () {
        var _i, _a, type, abi, contract, version, value;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _i = 0, _a = ["string", "bytes32", "uint16"];
                    _b.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    type = _a[_i];
                    abi = [{ "constant": true, "inputs": [], "name": "version", "outputs": [{ "name": "", "type": type }], "payable": false, "stateMutability": "view", "type": "function" }];
                    contract = new web3.eth.Contract(abi, contractAddress);
                    return [4 /*yield*/, rpc(contract.methods.version())];
                case 2:
                    version = _b.sent();
                    value = parse(type, version);
                    if (value)
                        return [2 /*return*/, { type: type, value: value }];
                    _b.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, {}];
            }
        });
    });
}
function run(nodeAddress, contractAddress) {
    return __awaiter(this, void 0, void 0, function () {
        var web3, version;
        return __generator(this, function (_a) {
            web3 = new Web3(nodeAddress);
            version = get(web3, contractAddress);
            if (web3.currentProvider.constructor.name == "WebsocketProvider")
                web3.currentProvider.connection.close();
            return [2 /*return*/, version];
        });
    });
}
exports.run = run;
