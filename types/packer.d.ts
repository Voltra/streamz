import { BaseStreamIterator } from "./abstractions/BaseStreamIterator";
import { Mapper } from "./types/functions";
export declare class Packer<T> {
    private it;
    constructor(it: BaseStreamIterator<T>);
    /**
     * Packs to an array
     */
    toArray(): T[];
    /**
     * Packs to an object computing the keys
     * @param keyGen - The function that computes a key from a value
     */
    toObjectBy(keyGen: Mapper<T, PropertyKey>): Record<PropertyKey, T>;
    /**
     * Packs to an object computing both keys and values
     * @param keyGen - The function that computes a key from an input value
     * @param valueGen - The function that computes a value from an input value
     */
    toObject<U>(keyGen: Mapper<T, PropertyKey>, valueGen: Mapper<T, U>): Record<PropertyKey, U>;
    /**
     * Packs the items to a Set
     */
    toSet(): Set<T>;
    /**
     * Packs to a Map computing the keys
     * @param keyGen - The function that computes a key from a value
     */
    toMapBy<K>(keyGen: Mapper<T, K>): Map<K, T>;
    /**
     * Packs to a Map computing both keys and values
     * @param keyGen - The function that computes a key from an input value
     * @param valueGen - The function that computes a value from an input value
     */
    toMap<K, V>(keyGen: Mapper<T, K>, valueGen: Mapper<T, V>): Map<K, V>;
}
