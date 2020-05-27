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
    it("assert", function (done) {
        var json = {
            type: "object",
            assert: ["a", "b", "c"],
            properties: {
                a: {
                    type: "number",
                    min: 100,
                    max: 1000
                }
            }
        };
        assert.deepEqual(Object.keys(index_1.toJson(index_1.fromJson(json)).assert), ["subject", "schema", "message"]);
        index_1.fromJson({
            type: "array",
            when: {
                reference: "/type",
                is: {
                    valid: [1, 2, true]
                },
                then: {
                    min: 1
                },
                otherwise: {
                    is: 1,
                    then: {
                        length: 2
                    },
                    otherwise: {
                        min: 0
                    }
                }
            }
        });
        done();
    });
});
