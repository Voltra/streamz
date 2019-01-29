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
    /**
     * @class ChunkIterator
     * An iterator that puts the items into chunks of fixed (max-)size
     */
    var ChunkIterator = (function () {
        function ChunkIterator(parent, size) {
            var _this = this;
            this.parent = parent;
            this.size = size;
            this.hasNext = function () { return _this.parent.hasNext(); };
            this.clone = function () { return new ChunkIterator(_this.parent.clone(), _this.size); };
            if (this.size <= 0)
                throw new Error("Invalid chunk size: must be greater than 0");
        }
        ChunkIterator.prototype.next = function () {
            var chunk = [];
            while (this.parent.hasNext() && chunk.length < this.size) {
                var value = this.parent.next().value();
                if (utils_1.streamIsValidValue(value))
                    chunk.push(value);
            }
            return chunk.length == 0
                ? utils_1.invalidStreamIteratorPayload()
                : { value: function () { return chunk; } };
        };
        return ChunkIterator;
    }());
    exports.ChunkIterator = ChunkIterator;
});
