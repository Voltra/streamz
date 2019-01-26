import { EndStreamIterator } from "../../abstractions/EndStreamIterator";
import { Mapper } from "../../types/functions";
import { BaseStreamIterator } from "../../abstractions/BaseStreamIterator";
import { streamIsValidValue } from "../../abstractions/utils";

export class ObjectPackerIterator<T, U> implements EndStreamIterator<object, T>{
    public constructor(
        private parent: BaseStreamIterator<T>,
        private keyGen: Mapper<T, any>,
        private valueGen: Mapper<T, U>
    ){}

    public hasNext = () => this.parent.hasNext();
    public next = () => this.parent.next();

    public process(): object{
        const ret: object = {};

        while(this.hasNext()){
            const val = this.next().value();
            if(streamIsValidValue(val)){
                const value: U = this.valueGen(val as T);
                const key = this.keyGen(val as T);
                ret[key] = value;
            }
        }

        return ret;
    }
}