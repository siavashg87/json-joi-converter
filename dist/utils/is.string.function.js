"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isStringFunction = isStringFunction;
function isStringFunction(str) {
    if (typeof str === 'string')
        return str.startsWith('(') || str.startsWith('function');
    return false;
}
