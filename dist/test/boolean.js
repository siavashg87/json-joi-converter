"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var index_1 = require("../index");
describe('Joi to Json - boolean', function () {
    it('date - min date', function (done) {
        assert.deepEqual(index_1.toJson(index_1.default.bool().truthy("Y").falsy("N")), {
            type: "boolean",
            falsy: ["N"],
            truthy: ["Y"]
        });
        done();
    });
});
