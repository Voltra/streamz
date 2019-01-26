import { BaseStreamIterator } from "../abstractions/BaseStreamIterator";
import { Consumer } from "../types/functions";
import { streamIsValidValue } from "../abstractions/utils";

/**
 * @class PeekIterator
 * An iterator that calls a function on each item
 */
export class PeekIterator<T> implements BaseStreamIterator<T>{
    public constructor(
        private parent: BaseStreamIterator<T>,
        private functor: Consumer<T>
    ){}

    public hasNext = () => this.parent.hasNext();
    public next(){
        const payload = this.parent.next();
        const value = payload.value();
        if(streamIsValidValue(value))
            this.functor(value as T);

        return payload;
    }

    public clone = () => new PeekIterator(this.parent.clone(), this.functor);
}