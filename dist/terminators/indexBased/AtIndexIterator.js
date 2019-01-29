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
    var AtIndexIterator = (function () {
        function AtIndexIterator(parent, index) {
            var _this = this;
            this.parent = parent;
            this.index = index;
            this.curr = 0;
            this.hasNext = function () { return _this.parent.hasNext(); };
            this.next = function () { return _this.parent.next(); };
            if (this.index < 0)
                throw new Error("Invalid index: must be >= 0");
        }
        AtIndexIterator.prototype.process = function () {
            while (this.hasNext()) {
                var value = this.next().value();
                if (!utils_1.streamIsValidValue(value)) {
                    if (this.curr == this.index)
                        return value;
                    this.curr += 1;
                }
            }
            return null;
        };
        return AtIndexIterator;
    }());
    exports.AtIndexIterator = AtIndexIterator;
});
