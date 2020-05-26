"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var index_1 = require("../index");
describe('Json to Joi', function () {
    it("simple number", function (done) {
        var json = {
            type: "object",
            properties: {
                a: {
                    type: "number",
                    min: 100,
                    max: 1000
                }
            }
        };
        assert.deepEqual(index_1.toJson(index_1.fromJson(json)), json);
        done();
    });
});
