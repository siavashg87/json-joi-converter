"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromJson = void 0;
var Joi = require("joi");
var utils_1 = require("./utils");
var OptionKey = {
    example: 'example',
    external: 'method',
    length: 'limit',
    max: 'limit',
    min: 'limit',
    pattern: 'pattern',
    regex: 'pattern',
};
function fromJson(_json) {
    var json = utils_1.cloneDeep(_json);
    if (utils_1.isObject(json) && 'then' in json)
        return utils_1.translateWhen(json);
    if (!utils_1.isObject(json) || !('type' in json))
        return json;
    var validation = json.type === 'object' ? Joi.object(utils_1.propertiesToJson(json.properties)) : Joi[json.type || 'any']();
    var _loop_1 = function (k) {
        var _a, _b;
        switch (k) {
            case 'type':
            case 'properties':
                break;
            // no arguments
            case 'exist':
            case 'forbidden':
            case 'keep':
            case 'optional':
            case 'required':
            case 'warn':
            case 'warning':
            case 'integer':
            case 'negative':
            case 'port':
            case 'positive':
            case 'alphanum':
            case 'creditCard':
            case 'hostname':
            case 'insensitive':
            case 'isoDate':
            case 'isoDuration':
            case 'lowercase':
            case 'token':
            case 'uppercase':
            case 'iso':
                validation = validation[k]();
                break;
            // single/no argument
            case 'empty':
            case 'base64':
            case 'dataUri':
            case 'domain':
            case 'email':
            case 'guid':
            case 'hex':
            case 'ip':
            case 'normalize':
            case 'uri':
            case 'uuid':
            case 'schema':
            case 'sort':
                if (k === 'uri' && utils_1.isObject(json[k]) && 'scheme' in json[k])
                    json[k].scheme = Array.isArray(json[k].scheme) ? json[k].scheme.map(function (o) { return utils_1.jsonToRegex(o); }) : utils_1.jsonToRegex(json[k].schema);
                validation = json[k] === true ? validation[k]() : validation[k](json[k]);
                break;
            // single argument
            case 'alter':
            case 'cast':
            case 'concat':
            case 'default':
            case 'description':
            case 'equal':
            case 'extract':
            case 'failover':
            case 'id':
            case 'label':
            case 'message':
            case 'messages':
            case 'meta':
            case 'note':
            case 'only':
            case 'options':
            case 'prefs':
            case 'preferences':
            case 'presence':
            case 'raw':
            case 'rule':
            case 'shared':
            case 'strict':
            case 'strip':
            case 'tag':
            case 'tailor':
            case 'unit':
            case 'falsy':
            case 'sensitive':
            case 'truthy':
            case 'greater':
            case 'less':
            case 'multiple':
            case 'precision':
            case 'sign':
            case 'unsafe':
            case 'case':
            case 'trim':
            case 'truncate':
            case 'append':
            case 'keys':
            case 'unknown':
            case 'has':
            case 'single':
            case 'sparse':
            case 'encoding':
            case 'timetamp':
            case 'match':
            case 'min':
            case 'max':
            case 'length':
            case 'map':
                {
                    var arg = json[k];
                    if (['default', 'multiple', 'less', 'max', 'min', 'greater', 'length'].includes(k)) {
                        if (utils_1.isObject(arg) && !('$ref' in arg)) {
                            if ('limit' in arg)
                                arg.limit = utils_1.jsonToRef(arg.limit);
                            else if ('base' in arg)
                                arg.base = utils_1.jsonToRef(arg.base);
                        }
                        else
                            arg = utils_1.jsonToRef(arg);
                    }
                    validation = validation[k](arg);
                }
                break;
            case 'error':
                validation = validation.error(new Error(json[k]));
                break;
            // with options
            case 'example':
            case 'external':
            case 'fork': {
                var arg1 = void 0, arg2 = void 0, key = OptionKey[k] || k;
                if (utils_1.isObject(json[k]) && key in json[k]) {
                    arg1 = json[k][key];
                    delete json[k][key];
                    arg2 = json[k][key];
                }
                else
                    arg1 = json[k];
                if (k === 'external')
                    arg1 = eval(arg1);
                // @ts-ignore
                validation = arg2 !== undefined ? validation[k](arg1, arg2) : validation[k](arg1);
                break;
            }
            // spread
            case 'allow':
            case 'disallow':
            case 'not':
            case 'valid':
            case 'invalid':
            case 'try':
                validation = validation[k].apply(validation, (Array.isArray(json[k]) ? json[k] : [json[k]]).map(function (v) { return utils_1.jsonToRef(v); }));
                break;
            case 'items':
            case 'ordered':
                validation = validation[k].apply(validation, (Array.isArray(json[k]) ? json[k] : [json[k]]).map(function (j) { return fromJson(j); }));
                break;
            // peers
            case 'and':
            case 'nand':
            case 'or':
            case 'oxor':
            case 'xor':
                var args = void 0;
                if (utils_1.isObject(json[k])) {
                    if ('options' in json[k])
                        args = __spreadArrays(json[k].peers, [json[k].options]);
                    else
                        args = json[k].peers;
                }
                else
                    args = json[k];
                validation = validation[k].apply(validation, args);
                break;
            // with options property
            case 'pattern':
            case 'regex': {
                if (json[k].type === 'object')
                    validation = validation.regex();
                else {
                    var arg1 = void 0, arg2 = void 0, arg3 = void 0, key = OptionKey[k] || k;
                    if (utils_1.isObject(json[k]) && key in json[k]) {
                        arg1 = json[k][key];
                        arg2 = json[k].options;
                        // object pattern
                        arg3 = json[k].schema;
                    }
                    else
                        arg1 = json[k];
                    arg1 = utils_1.jsonToRegex(arg1);
                    validation = arg3 !== undefined ? validation[k](arg1, arg3, arg2) : (arg2 !== undefined ? validation[k](arg1, arg2) : validation[k](arg1));
                }
                break;
            }
            case 'unique':
                if (json[k] === true)
                    validation = validation[k]();
                else {
                    var comparator = void 0, options = {};
                    if (utils_1.isObject(json[k])) {
                        if ('comparator' in json[k])
                            comparator = json[k].comparator;
                        if ('options' in json[k])
                            options = json[k].options;
                    }
                    else
                        comparator = json[k];
                    if (utils_1.isStringFunction(comparator))
                        comparator = eval(comparator);
                    validation = validation[k](comparator, options);
                }
                break;
            case 'rename':
                var from = json[k].from;
                var to = json[k].to;
                delete json[k].from;
                delete json[k].to;
                validation = validation[k](from, to, json[k]);
                break;
            case 'replace':
                (Array.isArray(json[k]) ? json[k] : [json[k]]).forEach(function (r) {
                    validation = validation[k](utils_1.jsonToRegex(r.find), r.replace);
                });
                break;
            case 'assert':
                var reference = void 0, schema = void 0, message = void 0;
                if (utils_1.isObject(json[k])) {
                    reference = json[k].reference;
                    schema = json[k].schema;
                    message = json[k].message;
                }
                else if (Array.isArray(json[k]))
                    _a = json[k], reference = _a[0], schema = _a[1], message = _a[2];
                reference = utils_1.jsonToRef(reference);
                validation = message !== undefined ? validation[k](reference, schema, message) : validation[k](reference, schema);
                break;
            case 'with':
            case 'without':
                {
                    var key = void 0, peers = void 0, options = void 0;
                    if (utils_1.isObject(json[k])) {
                        key = json[k].key;
                        peers = json[k].peers;
                        options = json[k].options;
                    }
                    else if (Array.isArray(json[k]))
                        _b = json[k], key = _b[0], peers = _b[1], options = _b[2];
                    validation = message !== undefined ? validation[k](key, peers, options) : validation[k](key, peers);
                }
                break;
            case 'when':
            case 'conditional':
                (Array.isArray(json[k]) ? json[k] : [json[k]]).forEach(function (when) {
                    validation = utils_1.translateWhen(when, validation);
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
