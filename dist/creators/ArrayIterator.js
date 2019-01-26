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
    var ArrayIterator = (function () {
        function ArrayIterator(arr) {
            var _this = this;
            this.arr = arr;
            this.index = 0;
            this.hasNext = function () { return _this.index < _this.arr.length; };
            this.clone = function () { return new ArrayIterator(_this.arr); };
        }
        ArrayIterator.prototype.next = function () {
            var value = this.arr[this.index];
            this.index += 1;
            return {
                value: function () { return value; }
            };
        };
        return ArrayIterator;
    }());
    exports.ArrayIterator = ArrayIterator;
    ;
});
