import { BaseStreamIterator } from "../abstractions/BaseStreamIterator";
import { Predicate } from "../types/functions";
import { invalidStreamIteratorPayload, streamIsValidValue } from "../abstractions/utils";

/**
 * @class FilterIterator
 * An iterator that filters elements according to a predicate
 */
export class FilterIterator<T> implements BaseStreamIterator<T>{
    public constructor(
        private parent: BaseStreamIterator<T>,
        private pred: Predicate<T>
    ){}

    public hasNext = () => this.parent.hasNext();

    public next(){
		while(this.parent.hasNext()){
			const value = this.parent.next().value();
			if(streamIsValidValue(value)){
				if(this.pred(value as T))
					return {
						value: () => value
					};
			}
		}

		return invalidStreamIteratorPayload();
	}

	public clone = () => new FilterIterator<T>(this.parent.clone(), this.pred);
}