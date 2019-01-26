(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./AllIterator"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AllIterator_1 = require("./AllIterator");
    var NoneIterator = (function () {
        function NoneIterator(parent, pred) {
            var _this = this;
            this.parent = parent;
            this.pred = pred;
            this.hasNext = function () { return _this.allDelegate.hasNext(); };
            this.next = function () { return _this.allDelegate.next(); };
            this.allDelegate = new AllIterator_1.AllIterator(this.parent, function (t) { return !_this.pred(t); });
        }
        NoneIterator.prototype.process = function () {
            return this.allDelegate.process();
        };
        return NoneIterator;
    }());
    exports.NoneIterator = NoneIterator;
});
