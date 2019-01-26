import { Mapper } from "../types/functions";
import { BaseStreamIterator } from "../abstractions/BaseStreamIterator";
import { invalidStreamIteratorPayload, streamIsValidValue } from "../abstractions/utils";

export class MapIterator<T, U> implements BaseStreamIterator<U>{
    public constructor(
        private parent: BaseStreamIterator<T>,
        private mapper: Mapper<T, U>
    ){}

    public hasNext = () => this.parent.hasNext();

    public next(){
        const value = this.parent.next().value();

        if(!streamIsValidValue(value))
            return invalidStreamIteratorPayload();

        const mapped = this.mapper(value as T);
        return {
            value: () => mapped
        }
    }

    public clone = () => new MapIterator<T, U>(this.parent.clone(), this.mapper);
}