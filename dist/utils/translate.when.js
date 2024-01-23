"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateWhen = void 0;
var Joi = require("joi");
var index_1 = require("../index");
var json_to_ref_1 = require("./json.to.ref");
function translateWhen(when, validation) {
    if (validation === void 0) { validation = null; }
    if (!validation)
        validation = Joi.any();
    var ref = null;
    if ('reference' in when) {
        ref = json_to_ref_1.jsonToRef(when.reference);
        delete when.reference;
    }
    else if ('schema' in when) {
        ref = index_1.fromJson(when.schema);
        delete when.schema;
    }
    if ('is' in when)
        when.is = index_1.fromJson(when.is);
    if ('then' in when)
        when.then = index_1.fromJson(when.then);
    if ('otherwise' in when)
        when.otherwise = index_1.fromJson(when.otherwise);
    if ('switch' in when)
        when.switch = when.switch.map(function (sw) {
            var op = {};
            if ('then' in when)
                op.then = index_1.fromJson(sw.then);
            if ('otherwise' in when)
                op.otherwise = index_1.fromJson(sw.otherwise);
            return op;
        });
    validation = validation.when(ref, when);
    return validation;
}
exports.translateWhen = translateWhen;
