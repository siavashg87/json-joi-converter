"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonToRef = void 0;
var Joi = require("joi");
var is_object_1 = require("./is.object");
function jsonToRef(ref) {
    if (is_object_1.isObject(ref) && '$ref' in ref) {
        var _ref = ref['$ref'];
        delete ref['$ref'];
        if ('adjust' in ref)
            ref.adjust = eval(ref.adjust);
        return Joi.ref(_ref, ref);
    }
    return ref;
}
exports.jsonToRef = jsonToRef;
