var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./ArrayIterator"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ArrayIterator_1 = require("./ArrayIterator");
    /**
     * @class SetIterator
     * An iterator that gets values from a Set
     */
    var SetIterator = (function () {
        function SetIterator(set) {
            var _this = this;
            this.set = set;
            this.hasNext = function () { return _this.arrayDelegate.hasNext(); };
            this.next = function () { return _this.arrayDelegate.next(); };
            this.clone = function () { return new SetIterator(_this.set); };
            this.arrayDelegate = new ArrayIterator_1.ArrayIterator(__spread(this.set.values()));
        }
        return SetIterator;
    }());
    exports.SetIterator = SetIterator;
});
