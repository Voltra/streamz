import { BaseStreamIterator } from "./abstractions/BaseStreamIterator"
import { ArrayPackerIterator } from "./terminators/packers/ArrayPackerIterator";
import { ObjectPackerByIterator } from "./terminators/packers/ObjectPackerByIterator";
import { ObjectPackerIterator } from "./terminators/packers/ObjectPackerIterator";
import { SetPackerIterator } from "./terminators/packers/SetPackerIterator";
import { MapPackerByIterator } from "./terminators/packers/MapPackerByIterator";
import { MapPackerIterator } from "./terminators/packers/MapPackerIterator";

import { Mapper } from "./types/functions"

export class Packer<T>{
    public constructor(
        private it: BaseStreamIterator<T>
    ){}

    /**
     * Packs to an array
     * @return {T[]}
     */
    public toArray(): T[]{
        const it = new ArrayPackerIterator<T>(this.it);
        return it.process();
    }

    /**
     * Packs to an object computing the keys
     * @param {Mapper<T, any>} keyGen - The function that computes a key from a value
     * @return {object}
     */
    public toObjectBy(keyGen: Mapper<T, any>): object{
        const it = new ObjectPackerByIterator<T>(this.it, keyGen);
        return it.process();
    }

    /**
     * Packs to an object computing both keys and values
     * @param {Mapper<T, any>} keyGen - The function that computes a key from an input value
     * @param {Mapper<T, U>} valueGen - The function that computes a value from an input value
     * @return {object}
     */
    public toObject<U>(keyGen: Mapper<T, any>, valueGen: Mapper<T, U>): object{
        const it = new ObjectPackerIterator<T, U>(this.it, keyGen, valueGen);
        return it.process();
    }

    /**
     * Packs the items to a Set
     * @return {Set}
     */
    public toSet(): Set<T>{
        const it = new SetPackerIterator<T>(this.it);
        return it.process();
    }

    /**
     * Packs to a Map computing the keys
     * @param {Mapper<T, K>} keyGen - The function that computes a key from a value
     * @return {Map}
     */
    public toMapBy<K>(keyGen: Mapper<T, K>): Map<K, T>{
        const it = new MapPackerByIterator<K, T>(this.it, keyGen);
        return it.process();
    }

    /**
     * Packs to a Map computing both keys and values
     * @param {Mapper<T, K>} keyGen - The function that computes a key from an input value
     * @param {Mapper<T, V>} valueGen - The function that computes a value from an input value
     * @return {Map}
     */
    public toMap<K, V>(keyGen: Mapper<T, K>, valueGen: Mapper<T, V>): Map<K, V>{
        const it = new MapPackerIterator<K, V, T>(this.it, keyGen, valueGen);
        return it.process();
    }
}