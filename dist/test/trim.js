"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var index_1 = require("../index");
describe('Joi to Json - trim', function () {
    it('trim', function (done) {
        assert.deepEqual(index_1.toJson(index_1.default.string().trim()), {
            type: 'string',
            trim: true
        });
        done();
    });
    it('trim - from json', function (done) {
        assert.deepEqual(index_1.toJson(index_1.fromJson({
            type: 'string',
            trim: true
        })), {
            type: 'string',
            trim: true
        });
        done();
    });
});
