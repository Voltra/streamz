import { EndStreamIterator } from "../../abstractions/EndStreamIterator";
import { BaseStreamIterator } from "../../abstractions/BaseStreamIterator";
import { streamIsValidValue } from "../../abstractions/utils";

export class SetPackerIterator<T> implements EndStreamIterator<Set<T>, T>{
    public constructor(
        private parent: BaseStreamIterator<T>
    ){}

    public hasNext = () => this.parent.hasNext();
    public next = () => this.parent.next();

    public process(): Set<T>{
        const set = new Set<T>();

        while(this.hasNext()){
            const value = this.next().value();
            if(streamIsValidValue(value))
                set.add(value as T);
        }

        return set;
    }
}