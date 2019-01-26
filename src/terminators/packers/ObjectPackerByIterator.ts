import { EndStreamIterator } from "../../abstractions/EndStreamIterator";
import { BaseStreamIterator } from "../../abstractions/BaseStreamIterator";
import { Mapper } from "../../types/functions";
import { streamIsValidValue } from "../../abstractions/utils";

export class ObjectPackerByIterator<T> implements EndStreamIterator<object, T>{
    public constructor(
        private parent: BaseStreamIterator<T>,
        private keyGen: Mapper<T, any>
    ){}

    public hasNext = () => this.parent.hasNext();
    public next = () => this.parent.next();

    public process(){
        const ret: object = {};
        while(this.hasNext()){
            const value = this.next().value();
            if(streamIsValidValue(value))
                ret[this.keyGen(value as T)] = value as T;
        }

        return ret;
    }
}