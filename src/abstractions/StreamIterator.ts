import { StreamIteratorPayload } from "./StreamIteratorPayload";

/**
 * @interface StreamIterator<T>
 * Base interface that represents a stream's iterator
 */
export interface StreamIterator<T>{
    /**
     * Determines whether or not this iterator can produce another value paylaod
     * @return {boolean} TRUE if it does, FALSE otherwise
     */
    hasNext(): boolean;

    /**
     * Retrieve the next iterator payload
     * @return {StreamIterator<T>}
     */
    next(): StreamIteratorPayload<T>;
}