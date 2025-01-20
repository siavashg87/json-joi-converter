"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isObject = isObject;
function isObject(obj) {
    return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
}
