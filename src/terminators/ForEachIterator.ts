import { EndStreamIterator } from "../abstractions/EndStreamIterator";
import { BaseStreamIterator } from "../abstractions/BaseStreamIterator";
import { Consumer } from "../types/functions";
import { streamIsValidValue } from "../abstractions/utils";

/**
 * @class ForEachIterator
 * An iterator that applies a function on each item
 */
export class ForEachIterator<T> implements EndStreamIterator<void, T>{
    public constructor(
        private parent: BaseStreamIterator<T>,
        private functor: Consumer<T>
    ){
        this.process();
    }

    public hasNext(){ return this.parent.hasNext(); }
    public next(){ return this.parent.next(); }

    public process(){
        while(this.hasNext()){
            const value = this.next().value();
            if(streamIsValidValue(value))
                this.functor(value as T);
        }
    }
}