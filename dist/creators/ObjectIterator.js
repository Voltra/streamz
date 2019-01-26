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
     * @class ObjectIterator
     * Stream iterator for an object
     */
    var ObjectIterator = (function () {
        function ObjectIterator(obj) {
            var _this = this;
            this.obj = obj;
            this.hasNext = function () { return _this.arrayDelegate.hasNext(); };
            this.next = function () { return _this.arrayDelegate.next(); };
            this.clone = function () { return new ObjectIterator(_this.obj); };
            this.arrayDelegate = new ArrayIterator_1.ArrayIterator(Object.entries(this.obj));
        }
        return ObjectIterator;
    }());
    exports.ObjectIterator = ObjectIterator;
});
