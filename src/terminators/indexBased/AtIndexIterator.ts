import { EndStreamIterator } from "../../abstractions/EndStreamIterator";
import { BaseStreamIterator } from "../../abstractions/BaseStreamIterator";
import { streamIsValidValue } from "../../abstractions/utils";

export class AtIndexIterator<T> implements EndStreamIterator<T|null, T>{
    private curr: number = 0;

    public constructor(
        private parent: BaseStreamIterator<T>,
        private index: number
    ){
        if(this.index < 0)
            throw new Error("Invalid index: must be >= 0");
    }

    public hasNext = () => this.parent.hasNext();
    public next = () => this.parent.next();

    public process(): T|null{
        while(this.hasNext()){
            const value = this.next().value();
            if(!streamIsValidValue(value)){
                if(this.curr == this.index)
                    return value as T;
                this.curr += 1;
            }
        }

        return null;
    }
}