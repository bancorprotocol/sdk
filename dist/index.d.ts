import { Token, ConversionPath, BlockchainType } from './path_generation';
interface Settings {
    ethereumNodeEndpoint: string;
    eosNodeEndpoint: string;
    ethereumContractRegistryAddress?: string;
}
interface Contract {
    blockchainType: BlockchainType;
    blockchainId: string;
}
export declare function init(args: Settings): Promise<void>;
export declare function buildPathsFile(): Promise<void>;
export declare function generatePath(sourceToken: Token, targetToken: Token): Promise<ConversionPath[]>;
export declare function getRateByPath(paths: ConversionPath[], amount: any): Promise<any>;
export declare function getRate(sourceToken: Token, targetToken: Token, amount: string): Promise<any>;
export declare function retrieveContractVersion(contract: Contract): Promise<{
    type: string;
    value: any;
}>;
export declare function fetchConversionEvents(token: Token, fromBlock: any, toBlock: any): Promise<any[]>;
export declare function fetchConversionEventsByTimestamp(token: Token, fromTimestamp: any, toTimestamp: any): Promise<any[]>;
export declare function getAllPaths(sourceToken: Token, targetToken: Token): Promise<any[]>;
declare const _default: {
    init: typeof init;
    getRate: typeof getRate;
    generatePath: typeof generatePath;
    getRateByPath: typeof getRateByPath;
    buildPathsFile: typeof buildPathsFile;
    retrieveContractVersion: typeof retrieveContractVersion;
    fetchConversionEvents: typeof fetchConversionEvents;
    fetchConversionEventsByTimestamp: typeof fetchConversionEventsByTimestamp;
    getAllPaths: typeof getAllPaths;
};
export default _default;
