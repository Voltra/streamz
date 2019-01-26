import { StreamIteratorPayload } from "./StreamIteratorPayload";

/**
 * @var emptyPayloadValue
 */
export const emptyPayloadValue = Symbol.for("streamz::empty");

/**
 * Determine whether or not the provided value is one of an empty payload
 * @param value - The value to test upon
 * @return {bool}
 */
export function isPayloadValueEmpty(value: any): boolean{
    return value === emptyPayloadValue;
}

/**
 * Determine whether or not the provided value is an actual value
 * @param value - The value to test upon
 */
export function streamIsValidValue(value: any): boolean{
    /*value !== null
    && value !== undefined
    && */
    return !isPayloadValueEmpty(value);
}

/**
 * Create an invalid stream iterator payload
 * @return {StreamIteratorPayload}
 */
export function invalidStreamIteratorPayload(){
    return {value: () => emptyPayloadValue};
}
