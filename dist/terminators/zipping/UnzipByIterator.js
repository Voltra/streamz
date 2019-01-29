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
    var UnzipByIterator = (function () {
        function UnzipByIterator(parent, firstGen, lastGen) {
            var _this = this;
            this.parent = parent;
            this.firstGen = firstGen;
            this.lastGen = lastGen;
            this.hasNext = function () { return _this.parent.hasNext(); };
            this.next = function () { return _this.parent.next(); };
        }
        UnzipByIterator.prototype.process = function () {
            var ts = [];
            var us = [];
            while (this.hasNext()) {
                var v = this.next().value();
                if (utils_1.streamIsValidValue(v)) {
                    var t = this.firstGen(v);
                    var u = this.lastGen(v);
                    ts.push(t);
                    us.push(u);
                }
            }
            return [ts, us];
        };
        return UnzipByIterator;
    }());
    exports.UnzipByIterator = UnzipByIterator;
});
