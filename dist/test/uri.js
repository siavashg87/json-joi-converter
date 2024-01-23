"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var index_1 = require("../index");
describe('Joi to Json - uri', function () {
    it('uri', function (done) {
        assert.deepEqual(index_1.toJson(index_1.default.string().uri()), {
            type: 'string',
            uri: true
        });
        done();
    });
    it('uri - scheme', function (done) {
        assert.deepEqual(index_1.toJson(index_1.default.string().uri({ scheme: ['https'] })), {
            type: 'string',
            uri: {
                scheme: ['https']
            }
        });
        done();
    });
});
