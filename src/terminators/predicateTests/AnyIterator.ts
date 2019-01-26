import { EndStreamIterator } from "../../abstractions/EndStreamIterator";
import { BaseStreamIterator } from "../../abstractions/BaseStreamIterator";
import { Predicate } from "../../types/functions";
import { streamIsValidValue } from "../../abstractions/utils";

/**
 * @class AnyIterator
 * An iterator that determines whether or not any item
 * matches a given requirement/predicate
 */
export class AnyIterator<T> implements EndStreamIterator<boolean, T>{
    public constructor(
        private parent: BaseStreamIterator<T>,
        private pred: Predicate<T>
    ){}

    public hasNext(){ return this.parent.hasNext(); }
    public next(){ return this.parent.next(); }

    public process(): boolean{
        while(this.hasNext()){
            const value = this.next().value();
            if(streamIsValidValue(value)){
                if(this.pred(value as T))
                    return true;
            }
        }

        return false;
    }
}