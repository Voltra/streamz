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
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.KeyGen = {
        entries: function (_a) {
            var _b = __read(_a, 2), k = _b[0], _ = _b[1];
            return k;
        }
    };
    exports.ValueGen = {
        entries: function (_a) {
            var _b = __read(_a, 2), _ = _b[0], v = _b[1];
            return v;
        }
    };
    exports.Compare = {
        asc: function (lhs, rhs) {
            if (lhs == rhs)
                return 0;
            else
                return lhs < rhs ? -1 : 1;
        },
        desc: function (lhs, rhs) { return exports.Compare.asc(rhs, lhs); },
        mapped: {
            asc: function (fn) { return function (lhs, rhs) { return exports.Compare.asc(fn(lhs), fn(rhs)); }; },
            desc: function (fn) { return function (lhs, rhs) { return exports.Compare.desc(fn(lhs), fn(rhs)); }; }
        }
    };
});
