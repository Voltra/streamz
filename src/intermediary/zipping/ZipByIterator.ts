import { BaseStreamIterator } from "../../abstractions/BaseStreamIterator";
import { BiFn } from "../../types/functions";
import { streamIsValidValue, invalidStreamIteratorPayload } from "../../abstractions/utils";

export class ZipByIterator<T, U, V> implements BaseStreamIterator<V>{
    public constructor(
        private parent: BaseStreamIterator<T>,
        private other: BaseStreamIterator<U>,
        private mapper: BiFn<V, T, U>
    ){}

    public hasNext = () => this.parent.hasNext() && this.other.hasNext();

    public next(){
        const value = this.parent.next().value();
        const otherValue = this.other.next().value();

        if(streamIsValidValue(value) && streamIsValidValue(otherValue)){
            const finalValue: V = this.mapper(value as T, otherValue as U);
            return {
                value: () => finalValue
            }
        }

        return invalidStreamIteratorPayload();
    }

    public clone = () => new ZipByIterator<T, U, V>(this.parent.clone(), this.other.clone(), this.mapper);
}