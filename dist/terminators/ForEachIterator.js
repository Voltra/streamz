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
     * @class ForEachIterator
     * An iterator that applies a function on each item
     */
    var ForEachIterator = (function () {
        function ForEachIterator(parent, functor) {
            this.parent = parent;
            this.functor = functor;
            this.process();
        }
        ForEachIterator.prototype.hasNext = function () { return this.parent.hasNext(); };
        ForEachIterator.prototype.next = function () { return this.parent.next(); };
        ForEachIterator.prototype.process = function () {
            while (this.hasNext()) {
                var value = this.next().value();
                if (utils_1.streamIsValidValue(value))
                    this.functor(value);
            }
        };
        return ForEachIterator;
    }());
    exports.ForEachIterator = ForEachIterator;
});
