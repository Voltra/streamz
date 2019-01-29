import { BaseStreamIterator } from "../abstractions/BaseStreamIterator";
import { ArrayIterator } from "./ArrayIterator";

/**
 * @class SetIterator
 * An iterator that gets values from a Set
 */
export class SetIterator<T> implements BaseStreamIterator<T>{
    private arrayDelegate: ArrayIterator<T>;

    public constructor(
        private set: Set<T>
    ){
        this.arrayDelegate = new ArrayIterator([...this.set.values()]);
    }

    public hasNext = () => this.arrayDelegate.hasNext();
    public next = () => this.arrayDelegate.next();
    public clone = () => new SetIterator<T>(this.set);
}