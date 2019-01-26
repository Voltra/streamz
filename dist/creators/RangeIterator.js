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
     * @class RangeIterator
     * Creates an iterator for a range of numbers
     */
    var RangeIterator = (function () {
        function RangeIterator(lower, higher, step) {
            if (lower === void 0) { lower = 0; }
            if (higher === void 0) { higher = Infinity; }
            if (step === void 0) { step = 1; }
            var _this = this;
            this.lower = lower;
            this.higher = higher;
            this.step = step;
            this.hasNext = function () { return _this.lower < _this.higher; };
            this.clone = function () { return new RangeIterator(_this._lower, _this.higher, _this.step); };
            this._lower = this.lower;
        }
        RangeIterator.prototype.next = function () {
            var value = this.lower;
            this.lower += this.step;
            return {
                value: function () { return value; }
            };
        };
        return RangeIterator;
    }());
    exports.RangeIterator = RangeIterator;
    ;
});
