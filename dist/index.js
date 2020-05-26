"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toJson = exports.fromJson = void 0;
var Joi = require("@hapi/joi");
var Utils_1 = require("./Utils");
var OptionKey = {
    example: "example",
    external: "method",
    length: "limit",
    max: "limit",
    min: "limit",
    pattern: "pattern",
    regex: "pattern",
};
function fromJson(json) {
    var validation = json.type === "object" ? Joi.object(Utils_1.propertiesToJson(json.properties)) : Joi[json.type]();
    var _loop_1 = function (k) {
        var _a, _b;
        switch (k) {
            case "type":
            case "properties":
                break;
            // no arguments
            case "exist":
            case "forbidden":
            case "keep":
            case "optional":
            case "required":
            case "warn":
            case "warning":
            case "integer":
            case "negative":
            case "port":
            case "positive":
            case "alphanum":
            case "creditCard":
            case "hostname":
            case "insensitive":
            case "isoDate":
            case "isoDuration":
            case "lowercase":
            case "token":
            case "uppercase":
            case "iso":
                validation = validation[k]();
                break;
            // single/no argument
            case "empty":
            case "base64":
            case "dataUri":
            case "domain":
            case "email":
            case "guid":
            case "hex":
            case "ip":
            case "normalize":
            case "uri":
            case "uuid":
            case "schema":
            case "sort":
                if (k === "uri" && Utils_1.isObject(json[k]) && "scheme" in json[k])
                    json[k].schema = Array.isArray(json[k].schema) ? json[k].schema.map(function (o) { return Utils_1.jsonToRegex(o); }) : Utils_1.jsonToRegex(json[k].schema);
                validation = json[k] === true ? validation[k]() : validation[k](json[k]);
                break;
            // single argument
            case "allow":
            case "alter":
            case "cast":
            case "concat":
            case "default":
            case "description":
            case "disallow":
            case "equal":
            case "error":
            case "extract":
            case "failover":
            case "id":
            case "invalid":
            case "label":
            case "message":
            case "messages":
            case "meta":
            case "not":
            case "note":
            case "only":
            case "options":
            case "prefs":
            case "preferences":
            case "presence":
            case "raw":
            case "rule":
            case "shared":
            case "strict":
            case "strip":
            case "tag":
            case "tailor":
            case "unit":
            case "valid":
            case "validate":
            case "falsy":
            case "sensitive":
            case "truthy":
            case "greater":
            case "less":
            case "multiple":
            case "precision":
            case "sign":
            case "unsafe":
            case "case":
            case "trim":
            case "truncate":
            case "append":
            case "keys":
            case "unknown":
            case "has":
            case "single":
            case "sparse":
            case "encoding":
            case "timetamp":
            case "match":
            case "min":
            case "max":
            case "length":
            case "map":
                {
                    var arg = json[k];
                    if (["default", "multiple", "less", "max", "min", "greater", "length"].includes(k)) {
                        if (Utils_1.isObject(arg) && !("$ref" in arg)) {
                            if ("limit" in arg)
                                arg.limit = Utils_1.jsonToRef(arg.limit);
                            else if ("base" in arg)
                                arg.base = Utils_1.jsonToRef(arg.base);
                        }
                        else
                            arg = Utils_1.jsonToRef(arg);
                    }
                    validation = validation[k](arg);
                }
                break;
            // with options
            case "example":
            case "external":
            case "fork": {
                var arg1 = void 0, arg2 = void 0, key = OptionKey[k] || k;
                if (Utils_1.isObject(json[k]) && key in json[k]) {
                    arg1 = json[k][key];
                    delete json[k][key];
                    arg2 = json[k][key];
                }
                else
                    arg1 = json[k];
                if (k === "external")
                    arg1 = eval(arg1);
                // @ts-ignore
                validation = arg2 !== undefined ? validation[k](arg1, arg2) : validation[k](arg1);
                break;
            }
            // spread
            case "items":
            case "ordered":
            case "try":
                validation = validation[k].apply(validation, json[k]);
                break;
            // peers
            case "and":
            case "nand":
            case "or":
            case "oxor":
            case "xor":
                var args = void 0;
                if (Utils_1.isObject(json[k])) {
                    if ("options" in json[k])
                        args = __spreadArrays(json[k].peers, [json[k].options]);
                    else
                        args = json[k].peers;
                }
                else
                    args = json[k];
                validation = validation[k].apply(validation, args);
                break;
            // with options property
            case "pattern":
            case "regex": {
                if (json[k].type === "object")
                    validation = validation.regex();
                else {
                    var arg1 = void 0, arg2 = void 0, arg3 = void 0, key = OptionKey[k] || k;
                    if (Utils_1.isObject(json[k]) && key in json[k]) {
                        arg1 = json[k][key];
                        arg2 = json[k].options;
                        // object pattern
                        arg3 = json[k].schema;
                    }
                    else
                        arg1 = json[k];
                    arg1 = Utils_1.jsonToRegex(arg1);
                    validation = arg3 !== undefined ? validation[k](arg1, arg2, arg3) : arg2 !== undefined ? validation[k](arg1, arg2) : validation[k](arg1);
                }
                break;
            }
            case "unique":
                if (json[k] === true)
                    validation = validation[k]();
                else if (Utils_1.isObject(json[k])) {
                    var comparator = eval(json[k].comparator);
                    validation = "options" in json[k] ? validation[k](comparator, json[k].options) : validation[k](comparator);
                }
                break;
            case "rename":
                var from = json[k].from;
                var to = json[k].to;
                delete json[k].from;
                delete json[k].to;
                validation = validation[k](from, to, json[k]);
                break;
            case "replace":
                if (Array.isArray(json[k]))
                    json[k].forEach(function (f) {
                        validation[k] = validation[k](Utils_1.jsonToRegex(json[k].find), json[k].replace);
                    });
                else
                    validation[k] = validation[k](Utils_1.jsonToRegex(json[k].find), json[k].replace);
                break;
            case "assert":
                var reference = void 0, schema = void 0, message = void 0;
                if (Utils_1.isObject(json[k])) {
                    reference = json[k].reference;
                    schema = json[k].schema;
                    message = json[k].message;
                }
                else if (Array.isArray(json[k]))
                    _a = json[k], reference = _a[0], schema = _a[1], message = _a[2];
                reference = Utils_1.jsonToRef(reference);
                validation = message !== undefined ? validation[k](reference, schema, message) : validation[k](reference, schema);
                break;
            case "with":
            case "without":
                {
                    var key = void 0, peers = void 0, options = void 0;
                    if (Utils_1.isObject(json[k])) {
                        key = json[k].key;
                        peers = json[k].peers;
                        options = json[k].options;
                    }
                    else if (Array.isArray(json[k]))
                        _b = json[k], key = _b[0], peers = _b[1], options = _b[2];
                    validation = message !== undefined ? validation[k](key, peers, options) : validation[k](key, peers);
                }
                break;
            case "when":
            case "conditional":
                var ref = null;
                if ("reference" in json[k]) {
                    ref = Utils_1.jsonToRef(json[k].reference);
                    delete json[k].reference;
                }
                else if ("schema" in json[k]) {
                    ref = fromJson(json[k].schema);
                    delete json[k].schema;
                }
                validation = validation[k](ref, json[k]);
                break;
            default:
                throw new Error("Validation \"" + k + "\" not found!");
        }
    };
    for (var k in json) {
        _loop_1(k);
    }
    return validation;
}
exports.fromJson = fromJson;
function toJson(joi) {
    var json = {
        type: joi.type
    };
    Object.keys(joi).forEach(function (key) {
        var _a;
        var value = joi[key];
        switch (key) {
            case "_valids":
            case "_invalids":
                var schemaKey = null;
                switch (key) {
                    case "_valids":
                        schemaKey = "valid";
                        break;
                    case "_invalids":
                        schemaKey = "invalid";
                        break;
                }
                if (value) {
                    json[schemaKey] = [];
                    if (value._values)
                        json[schemaKey] = __spreadArrays(json[schemaKey], Array.from(value._values));
                    if (value._refs)
                        json[schemaKey] = __spreadArrays(json[schemaKey], Array.from(value._refs));
                }
                break;
            case "_flags":
                if (joi[key]) {
                    if ("default" in joi[key])
                        json.default = joi[key].default;
                    if ("presence" in joi[key])
                        json[joi[key].presence] = true;
                }
                break;
            case "_singleRules":
            case "_rules":
                joi[key].forEach(function (rule) {
                    var _a;
                    var method = rule.method;
                    var optionsOnly = ["guid", "uuid", "email", "hex", "hostname", "ip", "base64", "dataUri", "domain"];
                    var value = optionsOnly.includes(method)
                        ? ((!!Object.keys(((_a = rule.args) === null || _a === void 0 ? void 0 : _a.options) || {}).length) ? rule.args.options : true)
                        : (!!Object.keys(rule.args || {}).length) ? rule.args : true;
                    if (["length", "compare"].includes(method))
                        switch (rule.operator) {
                            case ">=":
                                method = "min";
                                break;
                            case "<=":
                                method = "max";
                                break;
                            case "<":
                                method = "less";
                                break;
                            case ">":
                                method = "greater";
                                break;
                        }
                    if (method === "sign") {
                        switch (value.sign) {
                            case "positive":
                                method = "positive";
                                value = true;
                                break;
                            case "negative":
                                method = "negative";
                                value = true;
                                break;
                        }
                    }
                    if (value === null || value === void 0 ? void 0 : value.limit)
                        value.limit = Utils_1.extractRef(value === null || value === void 0 ? void 0 : value.limit);
                    if (Utils_1.isObject(value)) {
                        if (Utils_1.isObject(value) && "limit" in value && Object.keys(value).length === 1)
                            value = value.limit;
                        if (Utils_1.isObject(value) && "base" in value && Object.keys(value).length === 1)
                            value = value.base;
                        if (Utils_1.isObject(value) && "regex" in value)
                            value.regex = Utils_1.regexToString(value.regex);
                    }
                    json[method] = value;
                });
                break;
            case "$_terms":
                if (Array.isArray((_a = joi[key]) === null || _a === void 0 ? void 0 : _a.replacements)) {
                    // @ts-ignore
                    json.replace = joi[key].replacements.map(function (r) {
                        return {
                            find: (r.pattern instanceof RegExp) ? Utils_1.regexToString(r.pattern) : r.pattern,
                            replace: r.replacement
                        };
                    });
                }
                break;
            case "_ids":
                if (value._byKey && json.type === "object") {
                    json.properties = {};
                    value._byKey.forEach(function (k) {
                        json.properties[k.id] = toJson(k.schema);
                    });
                }
        }
    });
    return json;
}
exports.toJson = toJson;
exports.default = Joi;
