import { BaseStreamIterator } from "../abstractions/BaseStreamIterator";
import { streamIsValidValue, invalidStreamIteratorPayload } from "../abstractions/utils";

/**
 * @class ChunkIterator
 * An iterator that puts the items into chunks of fixed (max-)size
 */
export class ChunkIterator<T> implements BaseStreamIterator<T[]>{
    public constructor(
        private parent: BaseStreamIterator<T>,
        private size: number
    ){
        if(this.size <= 0)
            throw new Error("Invalid chunk size: must be greater than 0");
    }

    public hasNext = () => this.parent.hasNext();

    public next(){
        const chunk: T[] = [];
        while(this.parent.hasNext() && chunk.length < this.size){
            const value = this.parent.next().value();
            if(streamIsValidValue(value))
                chunk.push(value as T);
        }

        return chunk.length == 0
        ? invalidStreamIteratorPayload()
        : { value: () => chunk };
    }

    public clone = () => new ChunkIterator(this.parent.clone(), this.size);
}