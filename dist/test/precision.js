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
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var index_1 = require("../index");
describe('Joi to Json - Precision - Strict/Convert', function () {
    it('precision', function (done) {
        var original_schema = index_1.default.number().precision(5);
        var json_schema = index_1.toJson(original_schema);
        var schema = index_1.fromJson(json_schema);
        assert.equal(json_schema.precision, 5);
        var result = schema.validate(5.123456);
        assert.equal(result.value, 5.12346);
        var schemaStrict = index_1.fromJson(__assign(__assign({}, json_schema), { strict: true }));
        var resultStrict = schemaStrict.validate(5.123456);
        assert.equal(!!resultStrict.error, true);
        var resultStrict2 = schemaStrict.validate(5.12345);
        assert.equal(resultStrict2.value, 5.12345);
        assert.equal(index_1.toJson(schemaStrict).strict, true);
        done();
    });
});
