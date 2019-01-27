import { BaseStreamIterator } from "../abstractions/BaseStreamIterator";
import { Mapper } from "../types/functions";
import { streamIsValidValue, invalidStreamIteratorPayload } from "../abstractions/utils";

export class UniqueByIterator<T, U> implements BaseStreamIterator<T>{
    private tagged: Set<U> = new Set();

    public constructor(
        private parent: BaseStreamIterator<T>,
        private mapper: Mapper<T, U>
    ){}

    public hasNext = () => this.parent.hasNext();

    public next(){
        let condition = true;
        while(condition){
            const value = this.parent.next().value();
            if(!streamIsValidValue(value))
                continue;

            const mapped = this.mapper(value as T);
            condition = !this.tagged.has(mapped);
            if(condition){
                this.tagged.add(mapped);
                return {
                    value: () => value as T
                }
            }
        }

        return invalidStreamIteratorPayload();
    }

    public clone = () => new UniqueByIterator(this.parent.clone(), this.mapper);
}