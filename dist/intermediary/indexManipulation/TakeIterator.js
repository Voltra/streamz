(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../../abstractions/utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var utils_1 = require("../../abstractions/utils");
    /**
     * @class TakeIterator
     * An iterator that only accepts a fixed amount of items
     */
    var TakeIterator = (function () {
        function TakeIterator(parent, amount) {
            if (amount === void 0) { amount = 1; }
            var _this = this;
            this.parent = parent;
            this.amount = amount;
            this.hasNext = function () { return _this.amount > 0; };
            this.clone = function () { return new TakeIterator(_this.parent.clone(), _this._amount); };
            this._amount = amount;
        }
        TakeIterator.prototype.next = function () {
            if (!this.parent.hasNext()) {
                this.amount = 0;
                return utils_1.invalidStreamIteratorPayload();
            }
            var value = this.parent.next().value();
            this.amount -= 1;
            return {
                value: function () { return value; }
            };
        };
        return TakeIterator;
    }());
    exports.TakeIterator = TakeIterator;
});
