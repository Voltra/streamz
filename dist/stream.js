(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./creators/ArrayIterator", "./creators/ObjectIterator", "./creators/RangeIterator", "./intermediary/MapIterator", "./intermediary/indexManipulation/TakeIterator", "./intermediary/FilterIterator", "./intermediary/PeekIterator", "./intermediary/UniqueIterator", "./intermediary/indexManipulation/SkipIterator", "./terminators/ForEachIterator", "./terminators/ReduceIterator", "./terminators/predicateTests/AllIterator", "./terminators/predicateTests/AnyIterator", "./terminators/predicateTests/NoneIterator", "./packer"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ArrayIterator_1 = require("./creators/ArrayIterator");
    var ObjectIterator_1 = require("./creators/ObjectIterator");
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
    var packer_1 = require("./packer");
    /**
     * @class Stream
     * An object capable of lazily manipulating collections
     */
    var Stream = (function () {
        /************************************************************************\
         * CONSTRUCTOR
        \************************************************************************/
        function Stream(it) {
            this.it = it;
        }
        /************************************************************************\
         * FACTORIES
        \************************************************************************/
        /**
         * Create a stream from an iterator
         * @return {Stream}
         */
        Stream.make = function (it) {
            return new Stream(it);
        };
        /**
         * Creates a stream from a comma separated list of arguments
         * @param args - variadic arguments
         */
        Stream.of = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return this.from(args);
        };
        /**
         * Creates a stream from an array
         * @param {T[]} args - The array to create a stream from
         * @return {Stream}
         */
        Stream.from = function (args) {
            return this.make(new ArrayIterator_1.ArrayIterator(args));
        };
        /**
         * Creates a stream from the entries of the given object
         * @param obj - The object to create a stream from
         * @return {Stream}
         */
        Stream.fromObject = function (obj) {
            return this.make(new ObjectIterator_1.ObjectIterator(obj));
        };
        /**
         * Creates a stream for a range of numbers
         * @param {number} lower - The lower bound (or higher bound of no other parameters)
         * @param {number|null} higher - The higher bound
         * @param {number} step - The increment value
         * @return {Stream}
         */
        Stream.range = function (lower, higher, step) {
            if (lower === void 0) { lower = 0; }
            if (higher === void 0) { higher = null; }
            if (step === void 0) { step = 1; }
            var it = higher === null
                ? new RangeIterator_1.RangeIterator(0, lower, step)
                : new RangeIterator_1.RangeIterator(lower, higher, step);
            return this.make(it);
        };
        /**
         * Creates an infinite stream of values from the lower bound to positive infinity
         * @param {number} lower - The lower bound
         * @param {number} step - The increment value
         * @return {Stream}
         */
        Stream.infinite = function (lower, step) {
            if (lower === void 0) { lower = 0; }
            if (step === void 0) { step = 1; }
            return this.range(lower, Infinity, step);
        };
        /************************************************************************\
         * UTILS
        \************************************************************************/
        /**
         * Creates a "clone" of this stream using the iterators' cloning semantics
         * @return {Stream}
         */
        Stream.prototype.clone = function () {
            return Stream.make(this.it.clone());
        };
        /************************************************************************\
         * INTERMEDIATES
        \************************************************************************/
        /**
         * Maps a T to a U using the given mapper funciton
         * @param {Mapper<T, U>} mapper - The mapper function
         * @return {Stream}
         */
        Stream.prototype.map = function (mapper) {
            return Stream.make(new MapIterator_1.MapIterator(this.it, mapper));
        };
        /**
         * FIlters values according to the given predicate
         * @param {Predicate<T>} predicate - The predicate to match
         * @return {Stream}
         */
        Stream.prototype.filter = function (predicate) {
            return Stream.make(new FilterIterator_1.FilterIterator(this.it, predicate));
        };
        /**
         * Applies a function to each value and passes the value
         * @param {Consumer<T>} functor - The function to call
         * @return {Stream}
         */
        Stream.prototype.peek = function (functor) {
            return Stream.make(new PeekIterator_1.PeekIterator(this.it, functor));
        };
        /**
         * Removes duplicates from the stream
         * @return {Stream}
         */
        Stream.prototype.unique = function () {
            return Stream.make(new UniqueIterator_1.UniqueIterator(this.it));
        };
        /********************************************************************\
         * INDEX MANIPULATION
        \********************************************************************/
        /**
         * Keeps exactly the given amount of items in the stream (or less if it can't)
         * @param {number} amount - The maximum amount of items to keep
         * @return {Stream}
         */
        Stream.prototype.take = function (amount) {
            if (amount === void 0) { amount = 10; }
            return Stream.make(new TakeIterator_1.TakeIterator(this.it, amount));
        };
        /**
         * Skips exactly the given amount of items before passing its first value
         * @param {number} amount - The maximum amount of items to skip
         * @return {Stream}
         */
        Stream.prototype.skip = function (amount) {
            if (amount === void 0) { amount = 10; }
            return Stream.make(new SkipIterator_1.SkipIterator(this.it, amount));
        };
        /**
         * Keeps only the items within the range [begin;end] or [begin;end) depending on a flag
         * @param {number} begin - The index to begin from
         * @param {number} end - The index to end from
         * @param {boolean} excludeRight - Determines whether or not the end should be included or not
         * @return {Stream}
         */
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
        /**
         * Consumes the stream and apply a function on each item
         * @param {Consumer<T>} functor - The function to apply
         */
        Stream.prototype.forEach = function (functor) {
            new ForEachIterator_1.ForEachIterator(this.it, functor);
        };
        /**
         * Consumes the stream and reduces its values into a single result
         * @param {Reducer<Acc, T>} reducer - The reducer function
         * @param {Acc} acc - The initial value of the accumulator/result
         * @return {Acc}
         */
        Stream.prototype.reduce = function (reducer, acc) {
            var it = new ReduceIterator_1.ReduceIterator(this.it, reducer, acc);
            return it.process();
        };
        /********************************************************************\
         * PREDICATE TESTS
        \********************************************************************/
        /**
         * Consumes the stream and tests whether or not all items matches the given predicate
         * @param {Predicate<T>} predicate - The predicate to match
         * @return {boolean}
         */
        Stream.prototype.all = function (predicate) {
            var it = new AllIterator_1.AllIterator(this.it, predicate);
            return it.process();
        };
        /**
         * Consumes the stream and tests whether or not any item matches the given predicate
         * @param {Predicate<T>} predicate - The predicate to match
         * @return {boolean}
         */
        Stream.prototype.any = function (predicate) {
            var it = new AnyIterator_1.AnyIterator(this.it, predicate);
            return it.process();
        };
        /**
         * Consumes the stream and tests whether or not none of the items matches the given predicate
         * @param {Predicate<T>} predicate - The predicate to match
         * @return {boolean}
         */
        Stream.prototype.none = function (predicate) {
            var it = new NoneIterator_1.NoneIterator(this.it, predicate);
            return it.process();
        };
        Object.defineProperty(Stream.prototype, "pack", {
            /********************************************************************\
             * PACKERS
            \********************************************************************/
            /**
             * @var pack
             * The packer for this stream
             */
            get: function () {
                return new packer_1.Packer(this.it);
            },
            enumerable: true,
            configurable: true
        });
        return Stream;
    }());
    exports.Stream = Stream;
});
