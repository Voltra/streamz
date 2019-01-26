(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./terminators/packers/ArrayPackerIterator", "./terminators/packers/ObjectPackerByIterator", "./terminators/packers/ObjectPackerIterator", "./terminators/packers/SetPackerIterator", "./terminators/packers/MapPackerByIterator", "./terminators/packers/MapPackerIterator"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ArrayPackerIterator_1 = require("./terminators/packers/ArrayPackerIterator");
    var ObjectPackerByIterator_1 = require("./terminators/packers/ObjectPackerByIterator");
    var ObjectPackerIterator_1 = require("./terminators/packers/ObjectPackerIterator");
    var SetPackerIterator_1 = require("./terminators/packers/SetPackerIterator");
    var MapPackerByIterator_1 = require("./terminators/packers/MapPackerByIterator");
    var MapPackerIterator_1 = require("./terminators/packers/MapPackerIterator");
    var Packer = (function () {
        function Packer(it) {
            this.it = it;
        }
        /**
         * Packs to an array
         * @return {T[]}
         */
        Packer.prototype.toArray = function () {
            var it = new ArrayPackerIterator_1.ArrayPackerIterator(this.it);
            return it.process();
        };
        /**
         * Packs to an object computing the keys
         * @param {Mapper<T, any>} keyGen - The function that computes a key from a value
         * @return {object}
         */
        Packer.prototype.toObjectBy = function (keyGen) {
            var it = new ObjectPackerByIterator_1.ObjectPackerByIterator(this.it, keyGen);
            return it.process();
        };
        /**
         * Packs to an object computing both keys and values
         * @param {Mapper<T, any>} keyGen - The function that computes a key from an input value
         * @param {Mapper<T, U>} valueGen - The function that computes a value from an input value
         * @return {object}
         */
        Packer.prototype.toObject = function (keyGen, valueGen) {
            var it = new ObjectPackerIterator_1.ObjectPackerIterator(this.it, keyGen, valueGen);
            return it.process();
        };
        /**
         * Packs the items to a Set
         * @return {Set}
         */
        Packer.prototype.toSet = function () {
            var it = new SetPackerIterator_1.SetPackerIterator(this.it);
            return it.process();
        };
        /**
         * Packs to a Map computing the keys
         * @param {Mapper<T, K>} keyGen - The function that computes a key from a value
         * @return {Map}
         */
        Packer.prototype.toMapBy = function (keyGen) {
            var it = new MapPackerByIterator_1.MapPackerByIterator(this.it, keyGen);
            return it.process();
        };
        /**
         * Packs to a Map computing both keys and values
         * @param {Mapper<T, K>} keyGen - The function that computes a key from an input value
         * @param {Mapper<T, V>} valueGen - The function that computes a value from an input value
         * @return {Map}
         */
        Packer.prototype.toMap = function (keyGen, valueGen) {
            var it = new MapPackerIterator_1.MapPackerIterator(this.it, keyGen, valueGen);
            return it.process();
        };
        return Packer;
    }());
    exports.Packer = Packer;
});
