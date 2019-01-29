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
     * @class ZipIterator
     * An iterator that zips with another
     */
    var ZipIterator = (function () {
        function ZipIterator(parent, other) {
            var _this = this;
            this.parent = parent;
            this.other = other;
            this.hasNext = function () { return _this.parent.hasNext() && _this.other.hasNext(); };
            this.clone = function () { return new ZipIterator(_this.parent.clone(), _this.other.clone()); };
        }
        ZipIterator.prototype.next = function () {
            var value = this.parent.next().value();
            var otherValue = this.other.next().value();
            if (utils_1.streamIsValidValue(value) && utils_1.streamIsValidValue(otherValue))
                return {
                    value: function () { return [value, otherValue]; }
                };
            return utils_1.invalidStreamIteratorPayload();
        };
        return ZipIterator;
    }());
    exports.ZipIterator = ZipIterator;
});
