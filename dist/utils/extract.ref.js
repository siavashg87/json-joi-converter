"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractRef = extractRef;
var is_function_1 = require("./is.function");
var is_object_1 = require("./is.object");
function extractRef(obj) {
    if (!(0, is_object_1.isObject)(obj) || !obj.hasOwnProperty('key'))
        return obj;
    var ref = {
        $ref: obj.key,
        // map: obj.map,
        // prefix: obj.prefix,
        // ancestor: obj.ancestor,
        // in: obj.in,
        // iterables: obj.iterables
    };
    ['map', 'prefix', 'in', 'iterables', 'adjust',].forEach(function (k) {
        if (obj[k])
            ref[k] = k === 'adjust' && (0, is_function_1.isFunction)(obj[k]) ? obj[k].toString() : obj[k];
    });
    return ref;
}
