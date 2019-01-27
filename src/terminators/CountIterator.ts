import { EndStreamIterator } from "../abstractions/EndStreamIterator";
import { BaseStreamIterator } from "../abstractions/BaseStreamIterator";
import { Predicate } from "../types/functions";
import { streamIsValidValue } from "../abstractions/utils";

/**
 * @class CountIterator
 * An iterator that counts the elements (with an optional predicate)
 */
export class CountIterator<T> implements EndStreamIterator<number, T>{
    private count: number = 0;

    public constructor(
        private parent: BaseStreamIterator<T>,
        private pred: Predicate<T> = (_ => true)
    ){}

    public hasNext = () => this.parent.hasNext();
    public next = () => this.parent.next();

    public process(){
        while(this.hasNext()){
            const value = this.next().value();
            if(streamIsValidValue(value)){
                if(this.pred(value as T))
                    this.count += 1;
            }
        }

        return this.count;
    }
}