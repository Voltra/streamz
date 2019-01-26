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
    var AnyIterator = (function () {
        function AnyIterator(parent, pred) {
            this.parent = parent;
            this.pred = pred;
        }
        AnyIterator.prototype.hasNext = function () { return this.parent.hasNext(); };
        AnyIterator.prototype.next = function () { return this.parent.next(); };
        AnyIterator.prototype.process = function () {
            while (this.hasNext()) {
                var value = this.next().value();
                if (utils_1.streamIsValidValue(value)) {
                    if (this.pred(value))
                        return true;
                }
            }
            return false;
        };
        return AnyIterator;
    }());
    exports.AnyIterator = AnyIterator;
});
