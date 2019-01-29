import { BaseStreamIterator } from "../abstractions/BaseStreamIterator";
import { ArrayIterator } from "./ArrayIterator";

/**
 * @class MapIterator
 * An iterator that creates a stream from a Map
 */
export class MapIterator<K, V> implements BaseStreamIterator<(K|V)[]>{
    private arrayDelegate: ArrayIterator<(K|V)[]>;
    public constructor(
        private map: Map<K, V>
    ){
        this.arrayDelegate = new ArrayIterator([...this.map.entries()]);
    }

    public hasNext = () => this.arrayDelegate.hasNext();
    public next = () => this.arrayDelegate.next();
    public clone = () => new MapIterator<K, V>(this.map);
}