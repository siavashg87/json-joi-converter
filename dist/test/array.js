"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
});
