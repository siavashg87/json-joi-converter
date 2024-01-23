"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var index_1 = require("../index");
describe('Joi to Json - binary', function () {
    it('toJson', function (done) {
        assert.deepEqual(index_1.toJson(index_1.default.binary()), {
            type: 'binary'
        });
        done();
    });
    it('fromJson', function (done) {
        assert.deepEqual(index_1.toJson(index_1.fromJson(index_1.toJson(index_1.default.binary()))), {
            type: 'binary'
        });
        done();
    });
    it('toJson - object', function (done) {
        assert.deepEqual(index_1.toJson(index_1.default.object({
            file: index_1.default.binary()
        })), {
            type: 'object',
            properties: {
                file: {
                    type: 'binary'
                }
            }
        });
        done();
    });
});
