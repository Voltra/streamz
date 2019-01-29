(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./stream"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var stream_1 = require("./stream");
    /**
     * Helper function that installs global extensions
     * @param ctx - The context on which it will be installed (e.g. window, global, self, this, etc...)
     */
    exports.extend = function (ctx) {
        if (ctx.Array) {
            ctx.Array.prototype.stream = function () {
                return stream_1.Stream.from(this);
            };
        }
        if (ctx.Object) {
            ctx.Object.prototype.stream = function () {
                return stream_1.Stream.fromObject(this);
            };
            ctx.Object.fromStreams = stream_1.Stream.zipToObject.bind(stream_1.Stream);
        }
        if (ctx.Map) {
            ctx.Map.prototype.stream = function () {
                return stream_1.Stream.fromMap(this);
            };
        }
        if (ctx.Set) {
            ctx.Set.prototype.stream = function () {
                return stream_1.Stream.fromSet(this);
            };
        }
        if (ctx.Number) {
            ctx.Number.range = stream_1.Stream.range.bind(stream_1.Stream);
            ctx.Number.infiniteRange = stream_1.Stream.infinite.bind(stream_1.Stream);
        }
    };
});
