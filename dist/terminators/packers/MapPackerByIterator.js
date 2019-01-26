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
     * @class MapPackerByIterator
     * An iterator that packs the input into a Map computing the keys from
     * the input values
     */
    var MapPackerByIterator = (function () {
        function MapPackerByIterator(parent, keyGen) {
            var _this = this;
            this.parent = parent;
            this.keyGen = keyGen;
            this.hasNext = function () { return _this.parent.hasNext(); };
            this.next = function () { return _this.parent.next(); };
        }
        MapPackerByIterator.prototype.process = function () {
            var map = new Map();
            while (this.hasNext()) {
                var value = this.next().value();
                if (utils_1.streamIsValidValue(value))
                    map.set(this.keyGen(value), value);
            }
            return map;
        };
        return MapPackerByIterator;
    }());
    exports.MapPackerByIterator = MapPackerByIterator;
});
