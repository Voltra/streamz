import { BaseStreamIterator } from "../abstractions/BaseStreamIterator";
import { ArrayIterator } from "./ArrayIterator"

/**
 * @class ObjectIterator
 * Stream iterator for an object
 */
export class ObjectIterator implements BaseStreamIterator<[string, any]>{
    private arrayDelegate: ArrayIterator<[string, any]>;

    public constructor(
        private obj: object
    ){
        this.arrayDelegate = new ArrayIterator<[string, any]>(
            Object.entries(this.obj)
        );
    }

    public hasNext = () => this.arrayDelegate.hasNext();
    public next = () => this.arrayDelegate.next();
    public clone = () => new ObjectIterator(this.obj);
}