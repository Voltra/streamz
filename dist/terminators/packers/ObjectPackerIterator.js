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
    var ObjectPackerIterator = (function () {
        function ObjectPackerIterator(parent, keyGen, valueGen) {
            var _this = this;
            this.parent = parent;
            this.keyGen = keyGen;
            this.valueGen = valueGen;
            this.hasNext = function () { return _this.parent.hasNext(); };
            this.next = function () { return _this.parent.next(); };
        }
        ObjectPackerIterator.prototype.process = function () {
            var ret = {};
            while (this.hasNext()) {
                var val = this.next().value();
                if (utils_1.streamIsValidValue(val)) {
                    var value = this.valueGen(val);
                    var key = this.keyGen(val);
                    ret[key] = value;
                }
            }
            return ret;
        };
        return ObjectPackerIterator;
    }());
    exports.ObjectPackerIterator = ObjectPackerIterator;
});
