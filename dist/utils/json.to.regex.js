"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonToRegex = void 0;
var is_object_1 = require("./is.object");
function jsonToRegex(regex) {
    if (regex.regex)
        regex = regex.regex;
    if (is_object_1.isObject(regex) && '$regex' in regex) {
        if ('flags' in regex)
            return new RegExp(regex['$regex'], regex.flags);
        return new RegExp(regex['$regex']);
    }
    return new RegExp(regex);
}
exports.jsonToRegex = jsonToRegex;
