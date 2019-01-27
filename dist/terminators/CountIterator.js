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
     * @class CountIterator
     * An iterator that counts the elements (with an optional predicate)
     */
    var CountIterator = (function () {
        function CountIterator(parent, pred) {
            if (pred === void 0) { pred = (function (_) { return true; }); }
            var _this = this;
            this.parent = parent;
            this.pred = pred;
            this.count = 0;
            this.hasNext = function () { return _this.parent.hasNext(); };
            this.next = function () { return _this.parent.next(); };
        }
        CountIterator.prototype.process = function () {
            while (this.hasNext()) {
                var value = this.next().value();
                if (utils_1.streamIsValidValue(value)) {
                    if (this.pred(value))
                        this.count += 1;
                }
            }
            return this.count;
        };
        return CountIterator;
    }());
    exports.CountIterator = CountIterator;
});
