/**
 * @var emptyPayloadValue
 */
export const emptyPayloadValue = Symbol.for("streamz::empty");

/**
 * Determine whether or not the provided value is one of an empty payload
 * @param value - The value to test upon
 * @return {bool}
 */
export function isPayloadValueEmpty(value: any){
    return value === emptyPayloadValue;
}

export function streamIsValidValue(value: any){
    /*value !== null
    && value !== undefined
    && */
    return !isPayloadValueEmpty(value);
}

export function invalidStreamIteratorPayload(){
    return {value: () => emptyPayloadValue};
}
