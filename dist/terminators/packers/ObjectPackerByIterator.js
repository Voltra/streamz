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
     * @class ObjectPackerByIterator
     * An iterator that packs values into an object by computing
     * the keys from the input values
     */
    var ObjectPackerByIterator = (function () {
        function ObjectPackerByIterator(parent, keyGen) {
            var _this = this;
            this.parent = parent;
            this.keyGen = keyGen;
            this.hasNext = function () { return _this.parent.hasNext(); };
            this.next = function () { return _this.parent.next(); };
        }
        ObjectPackerByIterator.prototype.process = function () {
            var ret = {};
            while (this.hasNext()) {
                var value = this.next().value();
                if (utils_1.streamIsValidValue(value))
                    ret[this.keyGen(value)] = value;
            }
            return ret;
        };
        return ObjectPackerByIterator;
    }());
    exports.ObjectPackerByIterator = ObjectPackerByIterator;
});
