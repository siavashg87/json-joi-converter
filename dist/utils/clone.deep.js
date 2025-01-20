"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloneDeep = cloneDeep;
function cloneDeep(json) {
    return JSON.parse(JSON.stringify(json));
}
