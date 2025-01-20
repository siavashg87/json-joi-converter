"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateWhen = translateWhen;
var Joi = __importStar(require("joi"));
var index_1 = require("../index");
var json_to_ref_1 = require("./json.to.ref");
function translateWhen(when, validation) {
    if (validation === void 0) { validation = null; }
    if (!validation)
        validation = Joi.any();
    var ref = null;
    if ('reference' in when) {
        ref = (0, json_to_ref_1.jsonToRef)(when.reference);
        delete when.reference;
    }
    else if ('schema' in when) {
        ref = (0, index_1.fromJson)(when.schema);
        delete when.schema;
    }
    if ('is' in when)
        when.is = (0, index_1.fromJson)(when.is);
    if ('then' in when)
        when.then = (0, index_1.fromJson)(when.then);
    if ('otherwise' in when)
        when.otherwise = (0, index_1.fromJson)(when.otherwise);
    if ('switch' in when)
        when.switch = when.switch.map(function (sw) {
            var op = {};
            if ('then' in when)
                op.then = (0, index_1.fromJson)(sw.then);
            if ('otherwise' in when)
                op.otherwise = (0, index_1.fromJson)(sw.otherwise);
            return op;
        });
    validation = validation.when(ref, when);
    return validation;
}
