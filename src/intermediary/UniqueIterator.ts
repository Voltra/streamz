import { BaseStreamIterator } from "../abstractions/BaseStreamIterator"
import { streamIsValidValue, invalidStreamIteratorPayload } from "../abstractions/utils";

/**
 * @class UniqueIterator
 * An iterator that only outputs unique items
 */
export class UniqueIterator<T> implements BaseStreamIterator<T>{
    private tagged: Set<T> = new Set<T>();

    public constructor(
        private parent: BaseStreamIterator<T>
    ){}

    public hasNext = () => this.parent.hasNext();

    public next(){
        let condition = true;
        while(condition){
            const value = this.parent.next().value();
            if(!streamIsValidValue(value))
                continue;

            condition = !this.tagged.has(value as T);
            if(condition){
                this.tagged.add(value as T);
                return {
                    value: () => value
                };
            }
        }

        return invalidStreamIteratorPayload();
    }

    public clone = () => new UniqueIterator<T>(this.parent.clone());
}