"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var index_1 = require("../index");
describe('Joi to Json - Array', function () {
    it('array', function (done) {
        var original_schema = index_1.default.object({
            a: index_1.default.string(),
            b: index_1.default.array().min(1).when('a', { is: 'a', then: index_1.default.array().min(2).required() })
        });
        var json_schema = index_1.toJson(original_schema);
        var schema = index_1.fromJson(json_schema);
        schema.validate({ a: 'a', b: [1] });
        done();
    });
    it('array includes', function (done) {
        var original_schema = index_1.default.object({
            a: index_1.default.string().when('b', {
                is: index_1.default.array().items(index_1.default.string().valid("one").required(), index_1.default.string()),
                then: index_1.default.string().required(),
                otherwise: index_1.default.string().forbidden(),
            }),
            b: index_1.default.array().min(1)
        });
        var json_schema = index_1.toJson(original_schema);
        var schema = index_1.fromJson(json_schema);
        var result_success = schema.validate({ a: 'a', b: ["one"] });
        var result_success2 = schema.validate({ a: 'a', b: ["one", "two"] });
        var result_fail = schema.validate({ a: 'a', b: ["two"] });
        assert.strictEqual(result_success.error, undefined);
        assert.strictEqual(result_success2.error, undefined);
        assert.strictEqual(!!result_fail.error, true);
        console.log(JSON.stringify(json_schema, null, 2));
        done();
    });
});
