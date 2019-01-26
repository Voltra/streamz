import { EndStreamIterator } from "../../abstractions/EndStreamIterator";
import { BaseStreamIterator } from "../../abstractions/BaseStreamIterator";
import { Mapper } from "../../types/functions";
import { streamIsValidValue } from "../../abstractions/utils";

export class MapPackerByIterator<K, T> implements EndStreamIterator<Map<K, T>, T>{
    public constructor(
        private parent: BaseStreamIterator<T>,
        private keyGen: Mapper<T, K>
    ){}

    public hasNext = () => this.parent.hasNext();
    public next = () => this.parent.next();

    public process(): Map<K, T>{
        const map = new Map<K, T>();

        while(this.hasNext()){
            const value = this.next().value();
            if(streamIsValidValue(value))
                map.set(this.keyGen(value as T), value as T);
        }

        return map;
    }
}