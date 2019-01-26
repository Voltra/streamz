import { EndStreamIterator } from "../../abstractions/EndStreamIterator";
import { BaseStreamIterator } from "../../abstractions/BaseStreamIterator";
import { Predicate } from "../../types/functions";
import { AnyIterator } from "./AnyIterator";

export class AllIterator<T> implements EndStreamIterator<boolean, T>{
    private anyDelegate: AnyIterator<T>;

    public constructor(
        private parent: BaseStreamIterator<T>,
        private pred: Predicate<T>
    ){
        this.anyDelegate = new AnyIterator<T>(
            this.parent,
            (t: T) => !this.pred(t)
        );
    }

    public hasNext = () => this.anyDelegate.hasNext();
    public next = () => this.anyDelegate.next();

    public process(): boolean{
        return !this.anyDelegate.process();
    }
}