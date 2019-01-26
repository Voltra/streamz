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
     * @class SkipIterator
     * Iterator that skips a given amount of items
     */
    var SkipIterator = (function () {
        function SkipIterator(parent, amount) {
            var _this = this;
            this.parent = parent;
            this.amount = amount;
            this.hasNext = function () { return _this.parent.hasNext(); };
            this.clone = function () { return new SkipIterator(_this.parent.clone(), _this._amount); };
            this._amount = this.amount;
        }
        SkipIterator.prototype.next = function () {
            while (this.amount >= 0) {
                this.parent.next();
                this.amount -= 1;
            }
            var value = this.parent.next().value();
            if (this.amount === 0)
                this.amount -= 1;
            return {
                value: function () { return value; }
            };
        };
        return SkipIterator;
    }());
    exports.SkipIterator = SkipIterator;
});
