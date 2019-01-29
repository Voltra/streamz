(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./stream", "./packer", "./utils", "./abstractions/utils", "./extend"], factory);
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
    exports.Compare = utils_1.Compare;
    var utils_2 = require("./abstractions/utils");
    exports.emptyPayloadValue = utils_2.emptyPayloadValue;
    exports.isPayloadValueEmpty = utils_2.isPayloadValueEmpty;
    exports.streamIsValidValue = utils_2.streamIsValidValue;
    exports.invalidStreamIteratorPayload = utils_2.invalidStreamIteratorPayload;
    var extend_1 = require("./extend");
    exports.extend = extend_1.extend;
});
