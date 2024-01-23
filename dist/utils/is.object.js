"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isObject = void 0;
function isObject(obj) {
    return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
}
exports.isObject = isObject;
