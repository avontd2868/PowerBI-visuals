// Type definitions for pako 0.2.5 nodeca / pako
// Project: https://github.com/nodeca/pako
// Copyright(C) 2014 by Vitaly Puzrin

declare module pako {
    export function inflate(compressedData: any, options: any): string; 
    export function gzip(compressedData: any, options: any): string;
}

