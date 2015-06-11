// Type definitions for msrcrypto
// Project: http://research.microsoft.com/en-us/projects/msrjscrypto/
// Copyright 2014 Microsoft

interface Subtle {
    encrypt(algorithm: any, keyHandle: any, buffer: any): any;
    importKey(algorithm: any, keyHandle: any, buffer: any): any;
    forceSync: any;
}

interface MsrCrypto {
    subtle: Subtle;
    initPrng(array: any): void;
}

declare var msrCrypto: MsrCrypto;
