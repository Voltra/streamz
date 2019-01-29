import { EndStreamIterator } from "../../abstractions/EndStreamIterator";
import { BaseStreamIterator } from "../../abstractions/BaseStreamIterator";
import { Mapper } from "../../types/functions";
import { streamIsValidValue } from "../../abstractions/utils";

export class UnzipViaIterator<T, U, V> implements EndStreamIterator<[T[], U[]], V>{
    public constructor(
        private parent: BaseStreamIterator<V>,
        private mapper: Mapper<V, (T|U)[]>
    ){}

    public hasNext = () => this.parent.hasNext();
    public next = () => this.parent.next();

    public process(){
        const ts: T[] = [];
        const us: U[] = [];

        while(this.hasNext()){
            const v = this.next().value();
            if(streamIsValidValue(v)){
                const [t, u] = this.mapper(v as V);
                ts.push(t as T);
                us.push(u as U);
            }
        }

        return [ts, us] as [T[], U[]];
    }
}