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
     * @class SetPackerIterator
     * An iterator that packs the input values into a set
     */
    var SetPackerIterator = (function () {
        function SetPackerIterator(parent) {
            var _this = this;
            this.parent = parent;
            this.hasNext = function () { return _this.parent.hasNext(); };
            this.next = function () { return _this.parent.next(); };
        }
        SetPackerIterator.prototype.process = function () {
            var set = new Set();
            while (this.hasNext()) {
                var value = this.next().value();
                if (utils_1.streamIsValidValue(value))
                    set.add(value);
            }
            return set;
        };
        return SetPackerIterator;
    }());
    exports.SetPackerIterator = SetPackerIterator;
});
