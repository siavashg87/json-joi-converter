"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractRef = void 0;
var is_function_1 = require("./is.function");
var is_object_1 = require("./is.object");
function extractRef(obj) {
    if (!is_object_1.isObject(obj) || !obj.hasOwnProperty('key'))
        return obj;
    var ref = {
        $ref: obj.key,
    };
    ['map', 'prefix', 'ancestor', 'in', 'iterables', 'adjust'].forEach(function (k) {
        if (obj.hasOwnProperty(k))
            ref[k] = k === 'adjust' && is_function_1.isFunction(obj[k]) ? obj[k].toString() : obj[k];
    });
    return ref;
}
exports.extractRef = extractRef;
