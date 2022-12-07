"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toJson = exports.fromJson = void 0;
var Joi = require("joi");
var lodash_1 = require("lodash");
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
function translateWhen(when, validation) {
    if (validation === void 0) { validation = null; }
    if (!validation)
        validation = Joi.any();
    var ref = null;
    if ("reference" in when) {
        ref = Utils_1.jsonToRef(when.reference);
        delete when.reference;
    }
    else if ("schema" in when) {
        ref = fromJson(when.schema);
        delete when.schema;
    }
    if ("is" in when)
        when.is = fromJson(when.is);
    if ("then" in when)
        when.then = fromJson(when.then);
    if ("otherwise" in when)
        when.otherwise = fromJson(when.otherwise);
    if ("switch" in when)
        when.switch = when.switch.map(function (sw) {
            var op = {};
            if ("then" in when)
                op.then = fromJson(sw.then);
            if ("otherwise" in when)
                op.otherwise = fromJson(sw.otherwise);
            return op;
        });
    validation = validation.when(ref, when);
    return validation;
}
function fromJson(_json) {
    var json = lodash_1.cloneDeep(_json);
    if (Utils_1.isObject(json) && "then" in json)
        return translateWhen(json);
    if (!Utils_1.isObject(json) || !("type" in json))
        return json;
    var validation = json.type === "object" ? Joi.object(Utils_1.propertiesToJson(json.properties)) : Joi[json.type || "any"]();
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
                    json[k].scheme = Array.isArray(json[k].scheme) ? json[k].scheme.map(function (o) { return Utils_1.jsonToRegex(o); }) : Utils_1.jsonToRegex(json[k].schema);
                validation = json[k] === true ? validation[k]() : validation[k](json[k]);
                break;
            // single argument
            case "alter":
            case "cast":
            case "concat":
            case "default":
            case "description":
            case "equal":
            case "extract":
            case "failover":
            case "id":
            case "label":
            case "message":
            case "messages":
            case "meta":
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
            //case "validate":
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
            case "error":
                validation = validation.error(new Error(json[k]));
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
            case "allow":
            case "disallow":
            case "not":
            case "valid":
            case "invalid":
            case "try":
                validation = validation[k].apply(validation, (Array.isArray(json[k]) ? json[k] : [json[k]]).map(function (v) { return Utils_1.jsonToRef(v); }));
                break;
            case "items":
            case "ordered":
                validation = validation[k].apply(validation, (Array.isArray(json[k]) ? json[k] : [json[k]]).map(function (j) { return fromJson(j); }));
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
                    validation = arg3 !== undefined ? validation[k](arg1, arg3, arg2) : (arg2 !== undefined ? validation[k](arg1, arg2) : validation[k](arg1));
                }
                break;
            }
            case "unique":
                if (json[k] === true)
                    validation = validation[k]();
                else {
                    var comparator = void 0, options = {};
                    if (Utils_1.isObject(json[k])) {
                        if ("comparator" in json[k])
                            comparator = json[k].comparator;
                        if ("options" in json[k])
                            options = json[k].options;
                    }
                    else
                        comparator = json[k];
                    if (Utils_1.isStringFunction(comparator))
                        comparator = eval(comparator);
                    validation = validation[k](comparator, options);
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
                (Array.isArray(json[k]) ? json[k] : [json[k]]).forEach(function (r) {
                    validation = validation[k](Utils_1.jsonToRegex(r.find), r.replace);
                });
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
                (Array.isArray(json[k]) ? json[k] : [json[k]]).forEach(function (when) {
                    validation = translateWhen(when, validation);
                });
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
    if (!Utils_1.isObject(joi)) {
        return joi;
    }
    var json = {
        type: joi.type
    };
    Object.keys(joi).forEach(function (key) {
        var _a, _b, _c, _d, _e;
        var value = joi[key];
        switch (key) {
            case "_valids":
            case "_invalids":
                var schemaKey = null;
                switch (key) {
                    case "_valids":
                        schemaKey = joi._flags.only === true ? "valid" : "allow";
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
                    ["default", "single", "sparse", "label", "unknown"].forEach(function (_fk) {
                        if (_fk in joi[key])
                            json[_fk] = joi[key][_fk];
                    });
                    if ("presence" in joi[key])
                        json[joi[key].presence] = true;
                }
                break;
            case "_singleRules":
            case "_rules":
                joi[key].forEach(function (rule) {
                    var _a;
                    if (rule.method === "items")
                        return;
                    var method = rule.method;
                    var optionsOnly = ["guid", "uuid", "email", "hex", "hostname", "ip", "base64", "dataUri", "domain", "uri"];
                    var value = lodash_1.cloneDeep(optionsOnly.includes(method)
                        ? ((!!Object.keys(((_a = rule.args) === null || _a === void 0 ? void 0 : _a.options) || {}).length) ? rule.args.options : true)
                        : (!!Object.keys(rule.args || {}).length) ? rule.args : true);
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
                    if (method === "trim")
                        value = true;
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
                if (Array.isArray((_a = joi[key]) === null || _a === void 0 ? void 0 : _a.items) && joi[key].items.length) {
                    json.items = joi[key].items.map(function (it) { return toJson(it); });
                    if (json.items.length === 1)
                        json.items = json.items[0];
                }
                if (Array.isArray((_b = joi[key]) === null || _b === void 0 ? void 0 : _b.ordered) && joi[key].ordered.length) {
                    json.ordered = joi[key].ordered.map(function (it) { return toJson(it); });
                }
                if (Array.isArray((_c = joi[key]) === null || _c === void 0 ? void 0 : _c.replacements)) {
                    // @ts-ignore
                    json.replace = joi[key].replacements.map(function (r) {
                        return {
                            find: (r.pattern instanceof RegExp) ? Utils_1.regexToString(r.pattern) : r.pattern,
                            replace: r.replacement
                        };
                    });
                }
                if (Array.isArray((_d = joi[key]) === null || _d === void 0 ? void 0 : _d.metas) && joi[key].metas.length) {
                    json.meta = {};
                    joi[key].metas.forEach(function (meta) { return json.meta = __assign(__assign({}, json.meta), meta); });
                }
                if (Array.isArray((_e = joi[key]) === null || _e === void 0 ? void 0 : _e.whens) && !!joi[key].whens.length) {
                    json.when = joi[key].whens.map(function (when) {
                        var op = {};
                        if (when.ref) {
                            op.reference = Utils_1.extractRef(when.ref);
                            if ("is" in when) {
                                op.is = toJson(when.is);
                            }
                        }
                        else {
                            if ("schema" in when)
                                op.schema = toJson(when.schema);
                        }
                        if ("then" in when)
                            op.then = toJson(when.then);
                        if ("otherwise" in when)
                            op.otherwise = toJson(when.otherwise);
                        if ("break" in when && typeof when.break === "boolean")
                            op.break = when.break;
                        if ("switch" in when)
                            op.switch = when.switch.map(function (sw) {
                                var op = {};
                                op.reference = Utils_1.extractRef(sw.ref);
                                if ("is" in sw)
                                    op.is = toJson(sw.is);
                                if ("then" in sw)
                                    op.then = toJson(sw.then);
                                if ("otherwise" in sw)
                                    op.otherwise = toJson(sw.otherwise);
                            });
                        return op;
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
