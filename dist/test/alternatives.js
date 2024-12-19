"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var index_1 = require("../index");
describe('Joi to Json - alternatives', function () {
    it('toJson', function (done) {
        assert.deepEqual(index_1.toJson(index_1.fromJson(index_1.toJson(index_1.default.alternatives().match('all').try(index_1.default.number().min(1), index_1.default.string().valid('a'))))), {
            type: 'alternatives',
            try: [
                {
                    min: 1,
                    type: 'number'
                },
                {
                    type: 'string',
                    valid: ['a']
                }
            ],
            match: 'all'
        });
        done();
    });
});
