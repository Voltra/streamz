var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
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
    var UnzipViaIterator = (function () {
        function UnzipViaIterator(parent, mapper) {
            var _this = this;
            this.parent = parent;
            this.mapper = mapper;
            this.hasNext = function () { return _this.parent.hasNext(); };
            this.next = function () { return _this.parent.next(); };
        }
        UnzipViaIterator.prototype.process = function () {
            var ts = [];
            var us = [];
            while (this.hasNext()) {
                var v = this.next().value();
                if (utils_1.streamIsValidValue(v)) {
                    var _a = __read(this.mapper(v), 2), t = _a[0], u = _a[1];
                    ts.push(t);
                    us.push(u);
                }
            }
            return [ts, us];
        };
        return UnzipViaIterator;
    }());
    exports.UnzipViaIterator = UnzipViaIterator;
});
