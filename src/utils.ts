import { Mapper } from "types/functions";

export const KeyGen = {
    entries: <K, V>([k, _]: [K, V]): K => k
};

export const ValueGen = {
    entries: <K, V>([_, v]: [K, V]): V => v
};

export const Compare = {
    asc: <T>(lhs: T, rhs: T): number => {
        if(lhs == rhs)
            return 0;
        else
            return lhs < rhs ? -1 : 1;
    },
    desc: <T>(lhs: T, rhs: T): number => Compare.asc(rhs, lhs),
    mapped: {
        asc: <T, U>(fn: Mapper<T, U>) => (lhs: T, rhs: T) => Compare.asc(fn(lhs), fn(rhs)),
        desc: <T, U>(fn: Mapper<T, U>) => (lhs: T, rhs: T) => Compare.desc(fn(lhs), fn(rhs))
    }
};