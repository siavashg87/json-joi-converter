"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var index_1 = require("../index");
describe('Joi to Json', function () {
    it("regex", function (done) {
        assert.deepEqual(index_1.toJson(index_1.default.string().regex(new RegExp(/^[\d]{4}-[\d]{2}-[\d]{2}$/))), {
            pattern: {
                options: {},
                regex: {
                    '$regex': '^[\\d]{4}-[\\d]{2}-[\\d]{2}$'
                }
            },
            type: 'string'
        });
        done();
    });
    it("regex", function (done) {
        assert.deepEqual(index_1.toJson(index_1.fromJson(index_1.toJson(index_1.default.string().regex(new RegExp(/^[\d]{4}-[\d]{2}-[\d]{2}$/))))), {
            pattern: {
                options: {},
                regex: {
                    '$regex': '^[\\d]{4}-[\\d]{2}-[\\d]{2}$'
                }
            },
            type: 'string'
        });
        done();
    });
});
