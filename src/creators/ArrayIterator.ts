import { BaseStreamIterator } from "../abstractions/BaseStreamIterator";

export class ArrayIterator<T> implements BaseStreamIterator<T>{
    private index: number = 0;

    public constructor(
        private arr: T[]
    ){}

    public hasNext = () => this.index < this.arr.length;

    public next(){
        const value = this.arr[this.index];
        this.index += 1;
        return {
            value: () => value
        };
    }

    public clone = () => new ArrayIterator<T>(this.arr);
};