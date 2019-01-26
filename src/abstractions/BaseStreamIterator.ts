import { StreamIterator } from "./StreamIterator";

/**
 * @interface BaseStreamIterator<T>
 * Interface that represents both creators and intermediary stream iterator
 * operations
 */
export interface BaseStreamIterator<T> extends StreamIterator<T>{
    /**
     * Cloning semantics (clones the entire stream iterator chain)
     * @return {BaseStreamIterator<T>} a complete clone
     */
    clone(): BaseStreamIterator<T>;
}