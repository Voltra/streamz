(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @var emptyPayloadValue
     */
    exports.emptyPayloadValue = Symbol.for("streamz::empty");
    /**
     * Determine whether or not the provided value is one of an empty payload
     * @param value - The value to test upon
     * @return {bool}
     */
    function isPayloadValueEmpty(value) {
        return value === exports.emptyPayloadValue;
    }
    exports.isPayloadValueEmpty = isPayloadValueEmpty;
    /**
     * Determine whether or not the provided value is an actual value
     * @param value - The value to test upon
     */
    function streamIsValidValue(value) {
        /*value !== null
        && value !== undefined
        && */
        return !isPayloadValueEmpty(value);
    }
    exports.streamIsValidValue = streamIsValidValue;
    /**
     * Create an invalid stream iterator payload
     * @return {StreamIteratorPayload}
     */
    function invalidStreamIteratorPayload() {
        return { value: function () { return exports.emptyPayloadValue; } };
    }
    exports.invalidStreamIteratorPayload = invalidStreamIteratorPayload;
});
