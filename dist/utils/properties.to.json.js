"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.propertiesToJson = propertiesToJson;
var index_1 = require("../index");
function propertiesToJson(properties) {
    var joi = {};
    for (var key in properties) {
        joi[key] = (0, index_1.fromJson)(properties[key]);
    }
    return joi;
}
