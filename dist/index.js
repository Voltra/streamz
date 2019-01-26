(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./stream", "./packer", "./utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var stream_1 = require("./stream");
    exports.Stream = stream_1.Stream;
    var packer_1 = require("./packer");
    exports.Packer = packer_1.Packer;
    var utils_1 = require("./utils");
    exports.KeyGen = utils_1.KeyGen;
    exports.ValueGen = utils_1.ValueGen;
});
