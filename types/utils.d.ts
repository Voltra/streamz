import { Mapper } from "types/functions";
export declare function isIterable<T>(obj: any): obj is Iterable<T>;
export declare const isNullish: (value: any) => boolean;
export declare const KeyGen: {
    entries: <K, V>([k, _]: [K, V]) => K;
};
export declare const ValueGen: {
    entries: <K, V>([_, v]: [K, V]) => V;
};
export declare const Compare: {
    asc: <T>(lhs: T, rhs: T) => number;
    desc: <T_1>(lhs: T_1, rhs: T_1) => number;
    mapped: {
        asc: <T_2, U>(fn: Mapper<T_2, U>) => (lhs: T_2, rhs: T_2) => number;
        desc: <T_3, U_1>(fn: Mapper<T_3, U_1>) => (lhs: T_3, rhs: T_3) => number;
    };
};
