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
    var ZipByIterator = (function () {
        function ZipByIterator(parent, other, mapper) {
            var _this = this;
            this.parent = parent;
            this.other = other;
            this.mapper = mapper;
            this.hasNext = function () { return _this.parent.hasNext() && _this.other.hasNext(); };
            this.clone = function () { return new ZipByIterator(_this.parent.clone(), _this.other.clone(), _this.mapper); };
        }
        ZipByIterator.prototype.next = function () {
            var value = this.parent.next().value();
            var otherValue = this.other.next().value();
            if (utils_1.streamIsValidValue(value) && utils_1.streamIsValidValue(otherValue)) {
                var finalValue_1 = this.mapper(value, otherValue);
                return {
                    value: function () { return finalValue_1; }
                };
            }
            return utils_1.invalidStreamIteratorPayload();
        };
        return ZipByIterator;
    }());
    exports.ZipByIterator = ZipByIterator;
});
