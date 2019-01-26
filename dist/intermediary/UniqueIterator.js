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
     * @class UniqueIterator
     * An iterator that only outputs unique items
     */
    var UniqueIterator = (function () {
        function UniqueIterator(parent) {
            var _this = this;
            this.parent = parent;
            this.tagged = new Set();
            this.hasNext = function () { return _this.parent.hasNext(); };
            this.clone = function () { return new UniqueIterator(_this.parent.clone()); };
        }
        UniqueIterator.prototype.next = function () {
            var condition = true;
            var _loop_1 = function () {
                var value = this_1.parent.next().value();
                if (!utils_1.streamIsValidValue(value))
                    return "continue";
                condition = !this_1.tagged.has(value);
                if (condition) {
                    this_1.tagged.add(value);
                    return { value: {
                            value: function () { return value; }
                        } };
                }
            };
            var this_1 = this;
            while (condition) {
                var state_1 = _loop_1();
                if (typeof state_1 === "object")
                    return state_1.value;
            }
            return utils_1.invalidStreamIteratorPayload();
        };
        return UniqueIterator;
    }());
    exports.UniqueIterator = UniqueIterator;
});
