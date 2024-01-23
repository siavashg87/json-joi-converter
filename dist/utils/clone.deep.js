"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloneDeep = void 0;
function cloneDeep(json) {
    return JSON.parse(JSON.stringify(json));
}
exports.cloneDeep = cloneDeep;
