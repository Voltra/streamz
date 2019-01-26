(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./creators/ArrayIterator", "./creators/RangeIterator", "./intermediary/MapIterator", "./intermediary/indexManipulation/TakeIterator", "./intermediary/FilterIterator", "./intermediary/PeekIterator", "./intermediary/UniqueIterator", "./intermediary/indexManipulation/SkipIterator", "./terminators/ForEachIterator", "./terminators/ReduceIterator", "./terminators/predicateTests/AllIterator", "./terminators/predicateTests/AnyIterator", "./terminators/predicateTests/NoneIterator", "./terminators/packers/ArrayPackerIterator", "./terminators/packers/ObjectPackerByIterator", "./terminators/packers/ObjectPackerIterator", "./terminators/packers/SetPackerIterator", "./terminators/packers/MapPackerByIterator", "./terminators/packers/MapPackerIterator"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ArrayIterator_1 = require("./creators/ArrayIterator");
    var RangeIterator_1 = require("./creators/RangeIterator");
    var MapIterator_1 = require("./intermediary/MapIterator");
    var TakeIterator_1 = require("./intermediary/indexManipulation/TakeIterator");
    var FilterIterator_1 = require("./intermediary/FilterIterator");
    var PeekIterator_1 = require("./intermediary/PeekIterator");
    var UniqueIterator_1 = require("./intermediary/UniqueIterator");
    var SkipIterator_1 = require("./intermediary/indexManipulation/SkipIterator");
    // import { BetweenIterator } from "./intermediary/indexManipulation/BetweenIterator";
    var ForEachIterator_1 = require("./terminators/ForEachIterator");
    var ReduceIterator_1 = require("./terminators/ReduceIterator");
    var AllIterator_1 = require("./terminators/predicateTests/AllIterator");
    var AnyIterator_1 = require("./terminators/predicateTests/AnyIterator");
    var NoneIterator_1 = require("./terminators/predicateTests/NoneIterator");
    var ArrayPackerIterator_1 = require("./terminators/packers/ArrayPackerIterator");
    var ObjectPackerByIterator_1 = require("./terminators/packers/ObjectPackerByIterator");
    var ObjectPackerIterator_1 = require("./terminators/packers/ObjectPackerIterator");
    var SetPackerIterator_1 = require("./terminators/packers/SetPackerIterator");
    var MapPackerByIterator_1 = require("./terminators/packers/MapPackerByIterator");
    var MapPackerIterator_1 = require("./terminators/packers/MapPackerIterator");
    var Stream = (function () {
        /************************************************************************\
         * CONSTRUCTOR
        \************************************************************************/
        function Stream(it) {
            this.it = it;
            /********************************************************************\
             * PACKERS
            \********************************************************************/
            this.pack = {
                stream: this,
                it: function () {
                    return this.stream.it;
                },
                toArray: function () {
                    var it = new ArrayPackerIterator_1.ArrayPackerIterator(this.it());
                    return it.process();
                },
                toObjectBy: function (keyGen) {
                    var it = new ObjectPackerByIterator_1.ObjectPackerByIterator(this.it(), keyGen);
                    return it.process();
                },
                toObject: function (keyGen, valueGen) {
                    var it = new ObjectPackerIterator_1.ObjectPackerIterator(this.it(), keyGen, valueGen);
                    return it.process();
                },
                toSet: function () {
                    var it = new SetPackerIterator_1.SetPackerIterator(this.it());
                    return it.process();
                },
                toMapBy: function (keyGen) {
                    var it = new MapPackerByIterator_1.MapPackerByIterator(this.it(), keyGen);
                    return it.process();
                },
                toMap: function (keyGen, valueGen) {
                    var it = new MapPackerIterator_1.MapPackerIterator(this.it(), keyGen, valueGen);
                    return it.process();
                }
            };
        }
        /************************************************************************\
         * FACTORIES
        \************************************************************************/
        Stream.make = function (it) {
            return new Stream(it);
        };
        Stream.of = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return this.from(args);
        };
        Stream.from = function (args) {
            return this.make(new ArrayIterator_1.ArrayIterator(args));
        };
        Stream.range = function (lower, higher, step) {
            if (lower === void 0) { lower = 0; }
            if (higher === void 0) { higher = null; }
            if (step === void 0) { step = 1; }
            var it = higher === null
                ? new RangeIterator_1.RangeIterator(0, lower, step)
                : new RangeIterator_1.RangeIterator(lower, higher, step);
            return this.make(it);
        };
        Stream.infinite = function (lower, step) {
            if (lower === void 0) { lower = 0; }
            if (step === void 0) { step = 1; }
            return this.range(lower, Infinity, step);
        };
        /************************************************************************\
         * UTILS
        \************************************************************************/
        Stream.prototype.clone = function () {
            return Stream.make(this.it.clone());
        };
        /************************************************************************\
         * INTERMEDIATES
        \************************************************************************/
        Stream.prototype.map = function (mapper) {
            return Stream.make(new MapIterator_1.MapIterator(this.it, mapper));
        };
        Stream.prototype.filter = function (predicate) {
            return Stream.make(new FilterIterator_1.FilterIterator(this.it, predicate));
        };
        Stream.prototype.peek = function (functor) {
            return Stream.make(new PeekIterator_1.PeekIterator(this.it, functor));
        };
        Stream.prototype.unique = function () {
            return Stream.make(new UniqueIterator_1.UniqueIterator(this.it));
        };
        /********************************************************************\
         * INDEX MANIPULATION
        \********************************************************************/
        Stream.prototype.take = function (amount) {
            if (amount === void 0) { amount = 10; }
            return Stream.make(new TakeIterator_1.TakeIterator(this.it, amount));
        };
        Stream.prototype.skip = function (amount) {
            if (amount === void 0) { amount = 10; }
            return Stream.make(new SkipIterator_1.SkipIterator(this.it, amount));
        };
        Stream.prototype.between = function (begin, end, excludeRight) {
            if (begin === void 0) { begin = 0; }
            if (end === void 0) { end = 10; }
            if (excludeRight === void 0) { excludeRight = false; }
            /* return Stream.make<T>(
                new BetweenIterator<T>(this.it, begin, end)
            ); */
            var takeAmount = excludeRight ? end - begin : end - begin + 1;
            return this.skip(begin - 1).take(takeAmount);
        };
        /************************************************************************\
         * TERMINATORS
        \************************************************************************/
        Stream.prototype.forEach = function (functor) {
            new ForEachIterator_1.ForEachIterator(this.it, functor);
        };
        Stream.prototype.reduce = function (reducer, acc) {
            var it = new ReduceIterator_1.ReduceIterator(this.it, reducer, acc);
            return it.process();
        };
        /********************************************************************\
         * PREDICATE TESTS
        \********************************************************************/
        Stream.prototype.all = function (predicate) {
            var it = new AllIterator_1.AllIterator(this.it, predicate);
            return it.process();
        };
        Stream.prototype.any = function (predicate) {
            var it = new AnyIterator_1.AnyIterator(this.it, predicate);
            return it.process();
        };
        Stream.prototype.none = function (predicate) {
            var it = new NoneIterator_1.NoneIterator(this.it, predicate);
            return it.process();
        };
        return Stream;
    }());
    exports.Stream = Stream;
});
