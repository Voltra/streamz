import { BaseStreamIterator } from "../../abstractions/BaseStreamIterator"
import { invalidStreamIteratorPayload } from "../../abstractions/utils"

export class TakeIterator<T> implements BaseStreamIterator<T>{
    private _amount: number;

    public constructor(
        private parent: BaseStreamIterator<T>,
        private amount: number = 1
    ){
        this._amount = amount;
    }

    public hasNext = () => this.amount > 0;

    public next(){
        if(!this.parent.hasNext()){
            this.amount = 0;
            return invalidStreamIteratorPayload();
        }

        const value = this.parent.next().value();
        this.amount -= 1;

        return {
            value: () => value
        }
    }

    public clone = () => new TakeIterator<T>(this.parent.clone(), this._amount);
}