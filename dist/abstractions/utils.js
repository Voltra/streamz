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
    exports.emptyPayloadValue = Symbol.for("streamz::empty");
    function isPayloadValueEmpty(value) {
        return value === exports.emptyPayloadValue;
    }
    exports.isPayloadValueEmpty = isPayloadValueEmpty;
    function streamIsValidValue(value) {
        /*value !== null
        && value !== undefined
        && */
        return !isPayloadValueEmpty(value);
    }
    exports.streamIsValidValue = streamIsValidValue;
    function invalidStreamIteratorPayload() {
        return { value: function () { return exports.emptyPayloadValue; } };
    }
    exports.invalidStreamIteratorPayload = invalidStreamIteratorPayload;
});
