import { Producer } from "../types/functions";
import { Maybe } from "../types/helpers";

/**
 * @interface StreamIteratorPayload<T>
 * The data payload retrieved from an iterator
 */
export interface StreamIteratorPayload<T>{
    // value: Producer<Maybe<T> | symbol>
    value: Producer<T | symbol>
}