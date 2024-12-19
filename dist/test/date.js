"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var index_1 = require("../index");
describe('Joi to Json - date', function () {
    it('date - min date', function (done) {
        assert.deepEqual(index_1.toJson(index_1.fromJson({
            type: 'object',
            properties: {
                birthdate: {
                    type: "date",
                    min: "1930-01-01T00:00:00.000Z",
                    required: true
                },
            }
        })), {
            type: 'object',
            properties: {
                birthdate: {
                    type: "date",
                    min: "1930-01-01T00:00:00.000Z",
                    required: true
                },
            }
        });
        done();
    });
});
