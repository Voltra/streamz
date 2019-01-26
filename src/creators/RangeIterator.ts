import { BaseStreamIterator } from "../abstractions/BaseStreamIterator"

export class RangeIterator implements BaseStreamIterator<number>{
    private _lower: number;

    public constructor(
        private lower: number = 0,
        private higher: number = Infinity,
        private step: number = 1
    ){
        this._lower = this.lower;
    }

    public hasNext = () => this.lower < this.higher;

    public next(){
        const value = this.lower;
        this.lower += this.step;
        return {
            value: () => value
        }
    }

    public clone = () => new RangeIterator(this._lower, this.higher, this.step);
};