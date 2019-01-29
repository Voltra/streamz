import { EndStreamIterator } from "../../abstractions/EndStreamIterator";
import { BaseStreamIterator } from "../../abstractions/BaseStreamIterator";
import { Mapper } from "../../types/functions";
import { streamIsValidValue } from "../../abstractions/utils";

export class UnzipByIterator<T, U, V> implements EndStreamIterator<(T[]|U[])[], V>{
    public constructor(
        private parent: BaseStreamIterator<V>,
        private firstGen: Mapper<V, T>,
        private lastGen: Mapper<V, U>
    ){}

    public hasNext = () => this.parent.hasNext();
    public next = () => this.parent.next();

    public process(){
        const ts: T[] = [];
        const us: U[] = [];

        while(this.hasNext()){
            const v = this.next().value();
            if(streamIsValidValue(v)){
                const t: T = this.firstGen(v as V);
                const u: U = this.lastGen(v as V);
                ts.push(t);
                us.push(u);
            }
        }

        return [ts, us];
    }
}