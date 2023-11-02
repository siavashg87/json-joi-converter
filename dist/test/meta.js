"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var index_1 = require("../index");
describe('Joi to Json - meta', function () {
    it('meta', function (done) {
        assert.deepEqual(index_1.toJson(index_1.default.string().meta({ test: true })), {
            meta: { test: true },
            type: 'string'
        });
        done();
    });
    it('meta object', function (done) {
        assert.deepEqual(index_1.toJson(index_1.default.object({
            test: index_1.default.string().meta({ test: true })
        })), {
            type: 'object',
            properties: {
                test: {
                    meta: { test: true },
                    type: 'string'
                }
            }
        });
        done();
    });
});
