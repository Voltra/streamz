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
     * @class ArrayPackerIterator
     * An iterator that packs the input into an array
     */
    var ArrayPackerIterator = (function () {
        function ArrayPackerIterator(parent) {
            var _this = this;
            this.parent = parent;
            this.hasNext = function () { return _this.parent.hasNext(); };
            this.next = function () { return _this.parent.next(); };
        }
        ArrayPackerIterator.prototype.process = function () {
            var ret = [];
            while (this.hasNext()) {
                var value = this.next().value();
                if (utils_1.streamIsValidValue(value))
                    ret.push(value);
            }
            return ret;
        };
        return ArrayPackerIterator;
    }());
    exports.ArrayPackerIterator = ArrayPackerIterator;
});
