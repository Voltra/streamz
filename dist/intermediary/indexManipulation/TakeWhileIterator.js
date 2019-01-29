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
     * @class TakeWhileIterator
     * An iterator that provides items while a predicate is satisfied
     */
    var TakeWhileIterator = (function () {
        function TakeWhileIterator(parent, pred) {
            var _this = this;
            this.parent = parent;
            this.pred = pred;
            this.canContinue = true;
            this.hasNext = function () { return _this.parent.hasNext() && _this.canContinue; };
            this.clone = function () { return new TakeWhileIterator(_this.parent.clone(), _this.pred); };
        }
        TakeWhileIterator.prototype.next = function () {
            var value = this.parent.next().value();
            if (utils_1.streamIsValidValue(value)) {
                this.canContinue = this.pred(value);
                console.log("value: " + value + ", can continue: " + this.canContinue);
                if (this.canContinue)
                    return {
                        value: function () { return value; }
                    };
            }
            return utils_1.invalidStreamIteratorPayload();
        };
        return TakeWhileIterator;
    }());
    exports.TakeWhileIterator = TakeWhileIterator;
});
