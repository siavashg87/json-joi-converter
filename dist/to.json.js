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
exports.toJson = void 0;
var utils_1 = require("./utils");
function toJson(joi) {
    if (!utils_1.isObject(joi)) {
        return joi;
    }
    var json = {
        type: joi.type
    };
    Object.keys(joi).forEach(function (key) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        var value = joi[key];
        //console.log(value, key)
        switch (key) {
            case '_preferences':
                if (((_a = joi._preferences) === null || _a === void 0 ? void 0 : _a.convert) === false)
                    json.strict = true;
                break;
            case '_valids':
            case '_invalids':
                var schemaKey = null;
                switch (key) {
                    case '_valids':
                        schemaKey = joi._flags.only === true ? 'valid' : 'allow';
                        break;
                    case '_invalids':
                        schemaKey = 'invalid';
                        break;
                }
                if (value) {
                    json[schemaKey] = [];
                    if (value._values)
                        json[schemaKey] = __spreadArrays(json[schemaKey], Array.from(value._values)).map(function (v) { return utils_1.extractRef(v); });
                    if (value._refs)
                        json[schemaKey] = __spreadArrays(json[schemaKey], Array.from(value._refs)).map(function (v) { return utils_1.extractRef(v); });
                }
                break;
            case '_flags':
                if (joi[key]) {
                    ['default', 'single', 'sparse', 'label', 'match'].forEach(function (_fk) {
                        if (_fk in joi[key])
                            json[_fk] = joi[key][_fk];
                    });
                    if ('presence' in joi[key])
                        json[joi[key].presence] = true;
                }
                break;
            case '_singleRules':
            case '_rules':
                joi[key].forEach(function (rule) {
                    var _a;
                    if (rule.method === 'items')
                        return;
                    var method = rule.method;
                    var optionsOnly = ['guid', 'uuid', 'email', 'hex', 'hostname', 'ip', 'base64', 'dataUri', 'domain', 'uri'];
                    var value = utils_1.cloneDeep(optionsOnly.includes(method)
                        ? ((Object.keys(((_a = rule.args) === null || _a === void 0 ? void 0 : _a.options) || {}).length) ? rule.args.options : true)
                        : (Object.keys(rule.args || {}).length) ? rule.args : true);
                    if (['length', 'compare'].includes(method))
                        switch (rule.operator) {
                            case '>=':
                                method = 'min';
                                break;
                            case '<=':
                                method = 'max';
                                break;
                            case '<':
                                method = 'less';
                                break;
                            case '>':
                                method = 'greater';
                                break;
                        }
                    if (method === 'sign') {
                        switch (value.sign) {
                            case 'positive':
                                method = 'positive';
                                value = true;
                                break;
                            case 'negative':
                                method = 'negative';
                                value = true;
                                break;
                        }
                    }
                    if (method === 'trim')
                        value = true;
                    if (value === null || value === void 0 ? void 0 : value.limit)
                        value.limit = utils_1.extractRef(value === null || value === void 0 ? void 0 : value.limit);
                    if (utils_1.isObject(value)) {
                        if (utils_1.isObject(value) && 'limit' in value && Object.keys(value).length === 1)
                            value = value.limit;
                        if (utils_1.isObject(value) && 'date' in value && Object.keys(value).length === 1)
                            value = value.date;
                        if (utils_1.isObject(value) && 'base' in value && Object.keys(value).length === 1)
                            value = value.base;
                        if (utils_1.isObject(value) && 'regex' in value)
                            value.regex = utils_1.regexToString(rule.args.regex);
                    }
                    json[method] = value;
                });
                break;
            case '$_terms':
                if (Array.isArray((_b = joi[key]) === null || _b === void 0 ? void 0 : _b.items) && joi[key].items.length) {
                    json.items = joi[key].items.map(function (it) { return toJson(it); });
                    if (json.items.length === 1)
                        json.items = json.items[0];
                }
                if (Array.isArray((_c = joi[key]) === null || _c === void 0 ? void 0 : _c.ordered) && joi[key].ordered.length) {
                    json.ordered = joi[key].ordered.map(function (it) { return toJson(it); });
                }
                if (Array.isArray((_d = joi[key]) === null || _d === void 0 ? void 0 : _d.matches) && joi[key].matches.length) {
                    json.try = joi[key].matches.map(function (it) { return toJson(it.schema); });
                }
                if ((_f = (_e = joi[key].truthy) === null || _e === void 0 ? void 0 : _e._values) === null || _f === void 0 ? void 0 : _f.size) {
                    json.truthy = Array.from(joi[key].truthy._values).map(function (v) { return toJson(v); });
                }
                if ((_h = (_g = joi[key].falsy) === null || _g === void 0 ? void 0 : _g._values) === null || _h === void 0 ? void 0 : _h.size) {
                    json.falsy = Array.from(joi[key].falsy._values).map(function (v) { return toJson(v); });
                }
                if (Array.isArray((_j = joi[key]) === null || _j === void 0 ? void 0 : _j.replacements)) {
                    // @ts-ignore
                    json.replace = joi[key].replacements.map(function (r) {
                        return {
                            find: (r.pattern instanceof RegExp) ? utils_1.regexToString(r.pattern) : r.pattern,
                            replace: r.replacement
                        };
                    });
                }
                if (Array.isArray((_k = joi[key]) === null || _k === void 0 ? void 0 : _k.metas) && joi[key].metas.length) {
                    json.meta = {};
                    joi[key].metas.forEach(function (meta) { return json.meta = __assign(__assign({}, json.meta), meta); });
                }
                if (Array.isArray((_l = joi[key]) === null || _l === void 0 ? void 0 : _l.whens) && !!joi[key].whens.length) {
                    json.when = joi[key].whens.map(function (when) {
                        var op = {};
                        if (when.ref) {
                            op.reference = utils_1.extractRef(when.ref);
                            if ('is' in when) {
                                op.is = toJson(when.is);
                            }
                        }
                        else {
                            if ('schema' in when)
                                op.schema = toJson(when.schema);
                        }
                        if ('then' in when)
                            op.then = toJson(when.then);
                        if ('otherwise' in when)
                            op.otherwise = toJson(when.otherwise);
                        if ('break' in when && typeof when.break === 'boolean')
                            op.break = when.break;
                        if ('switch' in when)
                            op.switch = when.switch.map(function (sw) {
                                var op = {};
                                op.reference = utils_1.extractRef(sw.ref);
                                if ('is' in sw)
                                    op.is = toJson(sw.is);
                                if ('then' in sw)
                                    op.then = toJson(sw.then);
                                if ('otherwise' in sw)
                                    op.otherwise = toJson(sw.otherwise);
                            });
                        return op;
                    });
                }
                break;
            case '_ids':
                if (value._byKey && json.type === 'object') {
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
