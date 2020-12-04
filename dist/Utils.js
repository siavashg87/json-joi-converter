"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.propertiesToJson = exports.extractRef = exports.jsonToRef = exports.jsonToRegex = exports.regexToString = exports.isFunction = exports.isStringFunction = exports.isObject = void 0;
var Joi = require("joi");
var index_1 = require("./index");
function isObject(obj) {
    return obj !== null && typeof obj === "object" && !Array.isArray(obj);
}
exports.isObject = isObject;
function isStringFunction(str) {
    if (typeof str === "string")
        return str.startsWith("(") || str.startsWith("function");
    return false;
}
exports.isStringFunction = isStringFunction;
exports.isFunction = function (fn) { return typeof fn === "function"; };
function regexToString(regex) {
    var str = regex.toString();
    var lastSlash = str.lastIndexOf("/");
    var output = {
        $regex: str.substr(1, lastSlash - 1)
    };
    if (str.length > (lastSlash + 1))
        output.flags = str.substr(lastSlash + 1, 10);
    return output;
}
exports.regexToString = regexToString;
function jsonToRegex(regex) {
    if (isObject(regex) && "$regex" in regex) {
        if ("flags" in regex)
            return new RegExp(regex["$regex"], regex.flags);
        return new RegExp(regex["$regex"]);
    }
    return new RegExp(regex);
}
exports.jsonToRegex = jsonToRegex;
function jsonToRef(ref) {
    if (isObject(ref) && "$ref" in ref) {
        var _ref = ref["$ref"];
        delete ref["$ref"];
        if ("adjust" in ref)
            ref.adjust = eval(ref.adjust);
        return Joi.ref(_ref, ref);
    }
    return ref;
}
exports.jsonToRef = jsonToRef;
function extractRef(obj) {
    if (!isObject(obj) || !obj.hasOwnProperty("key"))
        return obj;
    var ref = {
        $ref: obj.key,
    };
    ["map", "prefix", "ancestor", "in", "iterables", "adjust"].forEach(function (k) {
        if (obj.hasOwnProperty(k))
            ref[k] = k === "adjust" && exports.isFunction(obj[k]) ? obj[k].toString() : obj[k];
    });
    return ref;
}
exports.extractRef = extractRef;
function propertiesToJson(properties) {
    var joi = {};
    for (var key in properties) {
        joi[key] = index_1.fromJson(properties[key]);
    }
    return joi;
}
exports.propertiesToJson = propertiesToJson;
