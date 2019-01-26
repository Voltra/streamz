import { BaseStreamIterator } from "../../abstractions/BaseStreamIterator";
import { invalidStreamIteratorPayload } from "../../abstractions/utils";

/**
 * @deprecated Can be implemented by chaining skip and take operations
 */
export class BetweenIterator<T> implements BaseStreamIterator<T>{
    private _begin: number;
    private index: number = 0;

    public constructor(
        private parent: BaseStreamIterator<T>,
        private begin: number,
        private end: number
    ){
        this._begin = this.begin;
    }

    public hasNext = () => this.parent.hasNext() && this.begin < this.end;

    public next(){
        console.log(this.index);
        while(this.index < this.begin){
            this.parent.next();
            this.index += 1;
        }

        if(this.begin >= this.end)
            return invalidStreamIteratorPayload();

        const value = this.parent.next().value();
        // this.index += 1;
        this.begin += 1;
        return {
            value: () => value
        };
    }

    public clone = () => new BetweenIterator<T>(this.parent.clone(), this._begin, this.end);
}