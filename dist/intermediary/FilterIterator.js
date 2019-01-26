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
     * @class FilterIterator
     * An iterator that filters elements according to a predicate
     */
    var FilterIterator = (function () {
        function FilterIterator(parent, pred) {
            var _this = this;
            this.parent = parent;
            this.pred = pred;
            this.hasNext = function () { return _this.parent.hasNext(); };
            this.clone = function () { return new FilterIterator(_this.parent.clone(), _this.pred); };
        }
        FilterIterator.prototype.next = function () {
            var _loop_1 = function () {
                var value = this_1.parent.next().value();
                if (utils_1.streamIsValidValue(value)) {
                    if (this_1.pred(value))
                        return { value: {
                                value: function () { return value; }
                            } };
                }
            };
            var this_1 = this;
            while (this.parent.hasNext()) {
                var state_1 = _loop_1();
                if (typeof state_1 === "object")
                    return state_1.value;
            }
            return utils_1.invalidStreamIteratorPayload();
        };
        return FilterIterator;
    }());
    exports.FilterIterator = FilterIterator;
});
