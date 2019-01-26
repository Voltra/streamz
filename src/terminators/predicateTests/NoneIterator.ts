import { EndStreamIterator } from "../../abstractions/EndStreamIterator";
import { AllIterator } from "./AllIterator";
import { BaseStreamIterator } from "../../abstractions/BaseStreamIterator";
import { Predicate } from "../../types/functions";

/**
 * @class NoneIterator
 * An iterator that determines whether or not none of the items
 * matches a given requirement/predicate
 */
export class NoneIterator<T> implements EndStreamIterator<boolean, T>{
    private allDelegate: AllIterator<T>;

    public constructor(
        private parent: BaseStreamIterator<T>,
        private pred: Predicate<T>
    ){
        this.allDelegate = new AllIterator<T>(
            this.parent,
            (t: T) => !this.pred(t)
        );
    }

    public hasNext = () => this.allDelegate.hasNext();
    public next = () => this.allDelegate.next();

    public process(): boolean{
        return this.allDelegate.process();
    }
}