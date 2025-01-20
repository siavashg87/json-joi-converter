"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonToRegex = jsonToRegex;
var is_object_1 = require("./is.object");
function jsonToRegex(regex) {
    if (regex.regex)
        regex = regex.regex;
    if ((0, is_object_1.isObject)(regex) && '$regex' in regex) {
        if ('flags' in regex)
            return new RegExp(regex['$regex'], regex.flags);
        return new RegExp(regex['$regex']);
    }
    return new RegExp(regex);
}
