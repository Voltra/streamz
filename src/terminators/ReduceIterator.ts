import { EndStreamIterator } from "../abstractions/EndStreamIterator";
import { BaseStreamIterator } from "../abstractions/BaseStreamIterator"
import { Reducer } from "../types/functions";
import { streamIsValidValue } from "../abstractions/utils";

export class ReduceIterator<Acc, T> implements EndStreamIterator<Acc, T>{
    public constructor(
        private parent: BaseStreamIterator<T>,
        private reducer: Reducer<Acc, T>,
        private acc: Acc
    ){}

    public hasNext(){ return this.parent.hasNext(); }
    public next(){ return this.parent.next(); }

    public process(): Acc{
        while(this.hasNext()){
            const elem = this.next().value();
            if(streamIsValidValue(elem))
                this.acc = this.reducer(this.acc, elem as T);
        }

        return this.acc;
    }
}