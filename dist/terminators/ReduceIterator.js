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
    var ReduceIterator = (function () {
        function ReduceIterator(parent, reducer, acc) {
            this.parent = parent;
            this.reducer = reducer;
            this.acc = acc;
        }
        ReduceIterator.prototype.hasNext = function () { return this.parent.hasNext(); };
        ReduceIterator.prototype.next = function () { return this.parent.next(); };
        ReduceIterator.prototype.process = function () {
            while (this.hasNext()) {
                var elem = this.next().value();
                if (utils_1.streamIsValidValue(elem))
                    this.acc = this.reducer(this.acc, elem);
            }
            return this.acc;
        };
        return ReduceIterator;
    }());
    exports.ReduceIterator = ReduceIterator;
});
