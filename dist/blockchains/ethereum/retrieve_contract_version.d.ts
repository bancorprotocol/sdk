export declare function run(nodeAddress: any, contractAddress: any): Promise<{
    type: string;
    value: any;
} | {
    type?: undefined;
    value?: undefined;
}>;
