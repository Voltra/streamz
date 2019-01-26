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
    var MapIterator = (function () {
        function MapIterator(parent, mapper) {
            var _this = this;
            this.parent = parent;
            this.mapper = mapper;
            this.hasNext = function () { return _this.parent.hasNext(); };
            this.clone = function () { return new MapIterator(_this.parent.clone(), _this.mapper); };
        }
        MapIterator.prototype.next = function () {
            var value = this.parent.next().value();
            if (!utils_1.streamIsValidValue(value))
                return utils_1.invalidStreamIteratorPayload();
            var mapped = this.mapper(value);
            return {
                value: function () { return mapped; }
            };
        };
        return MapIterator;
    }());
    exports.MapIterator = MapIterator;
});
