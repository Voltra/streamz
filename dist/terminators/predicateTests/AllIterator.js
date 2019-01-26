(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./AnyIterator"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AnyIterator_1 = require("./AnyIterator");
    /**
     * @class AllIterator
     * An iterator that determines whether or not all items
     * match a given requirement/predicate
     */
    var AllIterator = (function () {
        function AllIterator(parent, pred) {
            var _this = this;
            this.parent = parent;
            this.pred = pred;
            this.hasNext = function () { return _this.anyDelegate.hasNext(); };
            this.next = function () { return _this.anyDelegate.next(); };
            this.anyDelegate = new AnyIterator_1.AnyIterator(this.parent, function (t) { return !_this.pred(t); });
        }
        AllIterator.prototype.process = function () {
            return !this.anyDelegate.process();
        };
        return AllIterator;
    }());
    exports.AllIterator = AllIterator;
});
