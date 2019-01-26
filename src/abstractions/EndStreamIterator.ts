import { StreamIterator } from "./StreamIterator"

/**
 * Interface that represents the last iterator of the iterator chain
 * @interface EndStreamIterator<Ret, T>
 */
export interface EndStreamIterator<Ret, T> extends StreamIterator<T>{
    /**
     * Process the return value from the iterator chain
     * @return Ret
     */
    process(): Ret;
}