import { BaseStreamIterator } from "../../abstractions/BaseStreamIterator";
import { Predicate } from "../../types/functions";
import { streamIsValidValue, invalidStreamIteratorPayload } from "../../abstractions/utils";

/**
 * @class TakeWhileIterator
 * An iterator that provides items while a predicate is satisfied
 */
export class TakeWhileIterator<T> implements BaseStreamIterator<T>{
    private canContinue = true;

    public constructor(
        private parent: BaseStreamIterator<T>,
        private pred: Predicate<T>
    ){}

    public hasNext = () => this.parent.hasNext() && this.canContinue;

    public next(){
        const value = this.parent.next().value();
        if(streamIsValidValue(value)){
            this.canContinue = this.pred(value as T);
            if(this.canContinue)
                return {
                    value: () => value as T
                };
        }

        return invalidStreamIteratorPayload();
    }

    public clone = () => new TakeWhileIterator(this.parent.clone(), this.pred);
}