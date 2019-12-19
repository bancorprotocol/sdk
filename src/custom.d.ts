declare module '*.abi' {
    const value: JSON;
    export default value;
}

declare module '!abi' {
    const value: JSON;
    export default value;
}

// declare module 'bancor-contracts' {
//     export function fn(): string;
// }
