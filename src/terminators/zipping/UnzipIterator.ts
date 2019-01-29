import { EndStreamIterator } from "../../abstractions/EndStreamIterator";
import { BaseStreamIterator } from "../../abstractions/BaseStreamIterator";
import { streamIsValidValue } from "../../abstractions/utils";

/**
 * @class UnzipIterator
 * An iterator that unzips a stream of pairs to a pair of arrays
 */
export class UnzipIterator<T, U> implements EndStreamIterator<[T[], U[]], [T, U]>{
    public constructor(
        private parent: BaseStreamIterator<[T, U]>
    ){}

    public hasNext = () => this.parent.hasNext();
    public next = () => this.parent.next();

    public process(){
        const ts: T[] = [];
        const us: U[] = [];
        while(this.hasNext()){
            const val = this.parent.next().value();
            if(streamIsValidValue(val)){
                const [t, u] = val;
                ts.push(t as T);
                us.push(u as U);
            }
        }

        return [ts, us] as [T[], U[]];
    }
}