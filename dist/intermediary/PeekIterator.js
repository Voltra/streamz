(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../abstractions/utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var utils_1 = require("../abstractions/utils");
    /**
     * @class PeekIterator
     * An iterator that calls a function on each item
     */
    var PeekIterator = (function () {
        function PeekIterator(parent, functor) {
            var _this = this;
            this.parent = parent;
            this.functor = functor;
            this.hasNext = function () { return _this.parent.hasNext(); };
            this.clone = function () { return new PeekIterator(_this.parent.clone(), _this.functor); };
        }
        PeekIterator.prototype.next = function () {
            var payload = this.parent.next();
            var value = payload.value();
            if (utils_1.streamIsValidValue(value))
                this.functor(value);
            return payload;
        };
        return PeekIterator;
    }());
    exports.PeekIterator = PeekIterator;
});
