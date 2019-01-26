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
     * @deprecated Can be implemented by chaining skip and take operations
     */
    var BetweenIterator = (function () {
        function BetweenIterator(parent, begin, end) {
            var _this = this;
            this.parent = parent;
            this.begin = begin;
            this.end = end;
            this.index = 0;
            this.hasNext = function () { return _this.parent.hasNext() && _this.begin < _this.end; };
            this.clone = function () { return new BetweenIterator(_this.parent.clone(), _this._begin, _this.end); };
            this._begin = this.begin;
        }
        BetweenIterator.prototype.next = function () {
            console.log(this.index);
            while (this.index < this.begin) {
                this.parent.next();
                this.index += 1;
            }
            if (this.begin >= this.end)
                return utils_1.invalidStreamIteratorPayload();
            var value = this.parent.next().value();
            // this.index += 1;
            this.begin += 1;
            return {
                value: function () { return value; }
            };
        };
        return BetweenIterator;
    }());
    exports.BetweenIterator = BetweenIterator;
});
