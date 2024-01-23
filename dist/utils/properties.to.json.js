"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.propertiesToJson = void 0;
var index_1 = require("../index");
function propertiesToJson(properties) {
    var joi = {};
    for (var key in properties) {
        joi[key] = index_1.fromJson(properties[key]);
    }
    return joi;
}
exports.propertiesToJson = propertiesToJson;
