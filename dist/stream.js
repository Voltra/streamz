(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./creators/ArrayIterator", "./creators/ObjectIterator", "./creators/RangeIterator", "./creators/MapIterator", "./creators/SetIterator", "./intermediary/MapIterator", "./intermediary/indexManipulation/TakeIterator", "./intermediary/FilterIterator", "./intermediary/PeekIterator", "./intermediary/UniqueIterator", "./intermediary/UniqueByIterator", "./intermediary/ChunkIterator", "./intermediary/zipping/ZipIterator", "./intermediary/zipping/ZipByIterator", "./intermediary/indexManipulation/SkipIterator", "./intermediary/indexManipulation/TakeWhileIterator", "./terminators/ForEachIterator", "./terminators/ReduceIterator", "./terminators/CountIterator", "./terminators/predicateTests/AllIterator", "./terminators/predicateTests/AnyIterator", "./terminators/predicateTests/NoneIterator", "./terminators/indexBased/AtIndexIterator", "./terminators/zipping/UnzipIterator", "./terminators/zipping/UnzipByIterator", "./terminators/zipping/UnzipViaIterator", "./packer", "./utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ArrayIterator_1 = require("./creators/ArrayIterator");
    var ObjectIterator_1 = require("./creators/ObjectIterator");
    var RangeIterator_1 = require("./creators/RangeIterator");
    var MapIterator_1 = require("./creators/MapIterator");
    var SetIterator_1 = require("./creators/SetIterator");
    var MapIterator_2 = require("./intermediary/MapIterator");
    var TakeIterator_1 = require("./intermediary/indexManipulation/TakeIterator");
    var FilterIterator_1 = require("./intermediary/FilterIterator");
    var PeekIterator_1 = require("./intermediary/PeekIterator");
    var UniqueIterator_1 = require("./intermediary/UniqueIterator");
    var UniqueByIterator_1 = require("./intermediary/UniqueByIterator");
    var ChunkIterator_1 = require("./intermediary/ChunkIterator");
    var ZipIterator_1 = require("./intermediary/zipping/ZipIterator");
    var ZipByIterator_1 = require("./intermediary/zipping/ZipByIterator");
    var SkipIterator_1 = require("./intermediary/indexManipulation/SkipIterator");
    // import { BetweenIterator } from "./intermediary/indexManipulation/BetweenIterator";
    var TakeWhileIterator_1 = require("./intermediary/indexManipulation/TakeWhileIterator");
    var ForEachIterator_1 = require("./terminators/ForEachIterator");
    var ReduceIterator_1 = require("./terminators/ReduceIterator");
    var CountIterator_1 = require("./terminators/CountIterator");
    var AllIterator_1 = require("./terminators/predicateTests/AllIterator");
    var AnyIterator_1 = require("./terminators/predicateTests/AnyIterator");
    var NoneIterator_1 = require("./terminators/predicateTests/NoneIterator");
    var AtIndexIterator_1 = require("./terminators/indexBased/AtIndexIterator");
    var UnzipIterator_1 = require("./terminators/zipping/UnzipIterator");
    var UnzipByIterator_1 = require("./terminators/zipping/UnzipByIterator");
    var UnzipViaIterator_1 = require("./terminators/zipping/UnzipViaIterator");
    var packer_1 = require("./packer");
    var utils_1 = require("./utils");
    /**
     * @class Stream
     * An object capable of lazily manipulating collections
     */
    var Stream = (function () {
        /************************************************************************\
         * CONSTRUCTOR
        \************************************************************************/
        function Stream(it) {
            var _this = this;
            this.it = it;
            /********************************************************************\
             * FILTERING
            \********************************************************************/
            /**
             * Only keeps non null items
             * @return  {Stream}
             */
            this.nonNull = function () { return _this.filter(function (v) { return v !== null; }); };
            /**
             * Only keeps non falsy items
             * @return  {Stream}
             */
            this.nonFalsy = function () { return _this.filter(function (v) { return !!v; }); };
            /**
             * Only keeps items that do not satisfy the given predicate
             * @param {Predicate<T>} predicate - The predicate that must not be satisfied
             * @return  {Stream}
             */
            this.filterNot = function (predicate) { return _this.filter(function (v) { return !predicate(v); }); };
            /**
             * @alias filterOut
             * Alias for Stream#filterNot
             */
            this.filterOut = function (predicate) { return _this.filterNot(predicate); };
            /**
             * Only keeps items that are instance of the provided class
             * @param {Function} _class - The class to test from
             * @return  {Stream}
             */
            this.filterIsIntance = function (_class) { return _this.filter(function (v) { return v instanceof Function; }); };
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
         * @param {obj} obj - The object to create a stream from
         * @return {Stream}
         */
        Stream.fromObject = function (obj) {
            return this.make(new ObjectIterator_1.ObjectIterator(obj));
        };
        /**
         * Creates a stream from the entries of the given map
         * @param {Map} map - The map to create a stream from
         * @return {Stream}
         */
        Stream.fromMap = function (map) {
            return this.make(new MapIterator_1.MapIterator(map));
        };
        /**
         * Creates a stream from the values of the given set
         * @param {Set} set - The set to create a stream from
         * @return {Stream}
         */
        Stream.fromSet = function (set) {
            return this.make(new SetIterator_1.SetIterator(set));
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
            return Stream.make(new MapIterator_2.MapIterator(this.it, mapper));
        };
        /**
         * Filters values according to the given predicate
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
        /**
         * Removes duplicates based on a selector
         * @param {Mapper<T, U>} selector - The mapper function that generates the "key" for comparison
         * @return {Stream}
         */
        Stream.prototype.uniqueBy = function (selector) {
            return Stream.make(new UniqueByIterator_1.UniqueByIterator(this.it, selector));
        };
        /**
         * Puts the items of the stream into chunks
         * @param {number} size - The max size of each chunk
         * @return {Stream}
         */
        Stream.prototype.chunked = function (size) {
            if (size === void 0) { size = 3; }
            return Stream.make(new ChunkIterator_1.ChunkIterator(this.it, size));
        };
        /************************************************************************\
         * ZIPPING
        \************************************************************************/
        /**
         * Zips this stream with another
         * @param {Stream} stream - The stream to zip with
         * @return {Stream}
         */
        Stream.prototype.zip = function (stream) {
            return Stream.make(new ZipIterator_1.ZipIterator(this.it, stream.it));
        };
        /**
         * Zips this stream with another using the zipping function
         * @param {Stream} stream - The stream to zip with
         * @param {BiFn<V, T, U>} mapper - Maps both items into the new item
         * @return {Stream}
         */
        Stream.prototype.zipBy = function (stream, mapper) {
            return Stream.make(new ZipByIterator_1.ZipByIterator(this.it, stream.it, mapper));
        };
        /**
         * Static helper for combining streams
         * @param {Stream} lhs - Ths LHS stream to zip with
         * @param {Stream} rhs - The RHS stream to zip with
         * @return {Stream}
         */
        Stream.zip = function (lhs, rhs) {
            return lhs.zip(rhs);
        };
        /**
         * Static helper for combining streams using a zipper function
         * @param {Stream} lhs - Ths LHS stream to zip with
         * @param {Stream} rhs - The RHS stream to zip with
         * @param {BiFn<V, T, U>} zipper - The zipper function
         * @return {Stream}
         */
        Stream.zipBy = function (lhs, rhs, zipper) {
            return lhs.zipBy(rhs, zipper);
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
        /**
         * Keeps items that satisfy the predicate until one does not
         * @param {Predicate<T>} predicate - The predicate to satisfy
         * @return {Stream}
         */
        Stream.prototype.takeWhile = function (predicate) {
            return Stream.make(new TakeWhileIterator_1.TakeWhileIterator(this.it, predicate));
        };
        /**
         * Keeps items that do not satisfy the predicate until one does
         * @param {Predicate<T>} predicate - The predicate to not satisfy
         * @return {Stream}
         */
        Stream.prototype.takeUntil = function (predicate) {
            return this.takeWhile(function (v) { return !predicate(v); });
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
        /**
         * Counts the amount of items (that satisfy the predicate if one is given)
         * @param {Predicate<T>} predicate - The predicate to match in order to be counted
         * @return {number}
         */
        Stream.prototype.count = function (predicate) {
            if (predicate === void 0) { predicate = (function (_) { return true; }); }
            var it = new CountIterator_1.CountIterator(this.it, predicate);
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
        /**
         * Consumes the stream and tests whether or not it contains elem
         * @param {T} elem - The item to look for
         * @return {boolean}
         */
        Stream.prototype.contains = function (elem) {
            return this.any(function (v) { return v === elem; });
        };
        /********************************************************************\
         * INDEX BASED
        \********************************************************************/
        Stream.prototype.atIndex = function (index) {
            var it = new AtIndexIterator_1.AtIndexIterator(this.it, index);
            return it.process();
        };
        Stream.prototype.atIndexOr = function (index, fallback) {
            return this.atIndex(index) || fallback;
        };
        Stream.prototype.first = function () {
            return this.atIndex(0);
        };
        Stream.prototype.firstOr = function (fallback) {
            return this.atIndexOr(0, fallback);
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
        /************************************************************************\
         * ZIPPING
        \************************************************************************/
        /**
         * Zips then pack to an object (using this as keys and the provided stream as values)
         * @param {Stream} stream - The stream to zip with
         * @return {object}
         */
        Stream.prototype.zipToObject = function (stream) {
            return this.zip(stream).pack.toObject(utils_1.KeyGen.entries, utils_1.ValueGen.entries);
        };
        /**
         * Static helper for zipping to an object
         * @param keys - The stream of keys
         * @param values - The stream of values
         * @return {object}
         */
        Stream.zipToObject = function (keys, values) {
            return keys.zipToObject(values);
        };
        /**
         * Consumes the stream and unzips it
         * @return {[X[], U[]]}
         */
        Stream.prototype.unzip = function () {
            var it = new UnzipIterator_1.UnzipIterator(this.it);
            return it.process();
        };
        /**
         * Consumes the stream and unzips using the mapper functions
         * @param {Mapper<T, X>} firstGen - Maps the item to the first value of the result
         * @param {Mapper<T, U>} lastGen - Maps the item to the last value of the result
         * @return {[X[], U[]]}
         */
        Stream.prototype.unzipBy = function (firstGen, lastGen) {
            var it = new UnzipByIterator_1.UnzipByIterator(this.it, firstGen, lastGen);
            return it.process();
        };
        /**
         * Consumes the stream and unzips via the provided mapper functions
         * @param {Mapper<T, (X|U)[]>} mapper - Maps the item to a [X, U]
         * @return {[X[], U[]]}
         */
        Stream.prototype.unzipVia = function (mapper) {
            var it = new UnzipViaIterator_1.UnzipViaIterator(this.it, mapper);
            return it.process();
        };
        /************************************************************************\
         * SORTING
        \************************************************************************/
        Stream.prototype.sortedWith = function (comparator) {
            return this.pack.toArray().sort(comparator);
        };
        Stream.prototype.sortedBy = function (mapper) {
            return this.sortedWith(utils_1.Compare.mapped.asc(mapper));
        };
        Stream.prototype.sortedByDesc = function (mapper) {
            return this.sortedWith(utils_1.Compare.mapped.desc(mapper));
        };
        Stream.prototype.sorted = function () {
            return this.sortedBy(function (x) { return x; });
        };
        Stream.prototype.sortedDesc = function () {
            return this.sortedByDesc(function (x) { return x; });
        };
        return Stream;
    }());
    exports.Stream = Stream;
});
