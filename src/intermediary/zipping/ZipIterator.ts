import { BaseStreamIterator } from "../../abstractions/BaseStreamIterator";
import { streamIsValidValue, invalidStreamIteratorPayload } from "../../abstractions/utils";

/**
 * @class ZipIterator
 * An iterator that zips with another
 */
export class ZipIterator<T, U> implements BaseStreamIterator<[T, U]>{
    public constructor(
        private parent: BaseStreamIterator<T>,
        private other: BaseStreamIterator<U>
    ){}

    public hasNext = () => this.parent.hasNext() && this.other.hasNext();

    public next(){
        const value = this.parent.next().value();
        const otherValue = this.other.next().value();

        if(streamIsValidValue(value) && streamIsValidValue(otherValue))
            return {
                value: () => [value as T, otherValue as U] as [T, U]
            };

        return invalidStreamIteratorPayload();
    }

    public clone = () => new ZipIterator<T, U>(this.parent.clone(), this.other.clone());
}