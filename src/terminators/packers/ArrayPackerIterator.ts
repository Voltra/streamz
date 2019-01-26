import { EndStreamIterator } from "../../abstractions/EndStreamIterator";
import { BaseStreamIterator } from "../../abstractions/BaseStreamIterator";
import { streamIsValidValue } from "../../abstractions/utils";

export class ArrayPackerIterator<T> implements EndStreamIterator<T[], T>{
    public constructor(
        private parent: BaseStreamIterator<T>
    ){}

    public hasNext = () => this.parent.hasNext();
    public next = () => this.parent.next();

    public process(): T[]{
        const ret: T[] = [];

        while(this.hasNext()){
            const value = this.next().value();
            if(streamIsValidValue(value))
                ret.push(value as T);
        }

        return ret;
    }
}