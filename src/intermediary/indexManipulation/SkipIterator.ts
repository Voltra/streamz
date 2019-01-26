import { BaseStreamIterator } from "../../abstractions/BaseStreamIterator";

/**
 * @class SkipIterator
 * Iterator that skips a given amount of items
 */
export class SkipIterator<T> implements BaseStreamIterator<T>{
    private _amount: number;

    public constructor(
        private parent: BaseStreamIterator<T>,
        private amount: number
    ){
        this._amount = this.amount;
    }

    public hasNext = () => this.parent.hasNext();

    public next(){
        while(this.amount >= 0){
            this.parent.next();
            this.amount -= 1;
        }

        const value = this.parent.next().value();
        if(this.amount === 0)
            this.amount -= 1;

        return {
            value: () => value
        };
    }

    public clone = () => new SkipIterator<T>(this.parent.clone(), this._amount);
}