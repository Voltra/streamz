import { EndStreamIterator } from "../../abstractions/EndStreamIterator";
import { BaseStreamIterator } from "../../abstractions/BaseStreamIterator";
import { Mapper } from "../../types/functions";
import { streamIsValidValue } from "../../abstractions/utils";

export class MapPackerIterator<K, V, T> implements EndStreamIterator<Map<K, V>, T>{
    public constructor(
        private parent: BaseStreamIterator<T>,
        private keyGen: Mapper<T, K>,
        private valueGen: Mapper<T, V>
    ){}

    public hasNext = () => this.parent.hasNext();
    public next = () => this.parent.next();

    public process(): Map<K, V>{
        const map = new Map<K, V>();

        while(this.hasNext()){
            const val = this.next().value();
            if(streamIsValidValue(val)){
                const key = this.keyGen(val as T);
                const value = this.valueGen(val as T);
                map.set(key, value);
            }
        }

        return map;
    }
}