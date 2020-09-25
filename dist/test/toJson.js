"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var index_1 = require("../index");
describe('Joi to Json', function () {
    it("email", function (done) {
        assert.deepEqual(index_1.toJson(index_1.default.string().email()), { "type": "string", "email": true });
        done();
    });
    it("email with options", function (done) {
        assert.deepEqual(index_1.toJson(index_1.default.string().email({
            allowUnicode: true
        })), {
            "type": "string", "email": {
                allowUnicode: true
            }
        });
        done();
    });
    it("email - min", function (done) {
        assert.deepEqual(index_1.toJson(index_1.default.string().email({
            allowUnicode: true
        }).min(10)), {
            "type": "string",
            "email": {
                allowUnicode: true
            },
            "min": 10
        });
        done();
    });
    it("dataUri", function (done) {
        assert.deepEqual(index_1.toJson(index_1.default.string().dataUri()), { "type": "string", "dataUri": { paddingRequired: true } });
        done();
    });
    it("dataUri with options", function (done) {
        assert.deepEqual(index_1.toJson(index_1.default.string().dataUri({ paddingRequired: false })), { "type": "string", "dataUri": { paddingRequired: false } });
        done();
    });
    it("domain", function (done) {
        assert.deepEqual(index_1.toJson(index_1.default.string().domain()), { "type": "string", "domain": true });
        done();
    });
    it("domain with options", function (done) {
        assert.deepEqual(index_1.toJson(index_1.default.string().domain({ allowUnicode: true })), { "type": "string", "domain": { allowUnicode: true } });
        done();
    });
    it("guid", function (done) {
        assert.deepEqual(index_1.toJson(index_1.default.string().guid()), { "type": "string", "guid": true });
        done();
    });
    it("guid with options", function (done) {
        assert.deepEqual(index_1.toJson(index_1.default.string().guid({ version: ["uuidv1", "uuidv2"] })), { "type": "string", "guid": { version: ["uuidv1", "uuidv2"] } });
        done();
    });
    it("hex", function (done) {
        assert.deepEqual(index_1.toJson(index_1.default.string().hex()), { "type": "string", "hex": { byteAligned: false } });
        done();
    });
    it("hex with options", function (done) {
        assert.deepEqual(index_1.toJson(index_1.default.string().hex({ byteAligned: true })), { "type": "string", "hex": { byteAligned: true } });
        done();
    });
    it("min", function (done) {
        assert.deepEqual(index_1.toJson(index_1.default.string().min(10)), { "type": "string", "min": 10 });
        assert.deepEqual(index_1.toJson(index_1.default.number().min(10)), { "type": "number", "min": 10 });
        done();
    });
    it("min with options", function (done) {
        assert.deepEqual(index_1.toJson(index_1.default.string().min(10, "UTF8")), { "type": "string", "min": { limit: 10, encoding: "UTF8" } });
        done();
    });
    it("max", function (done) {
        assert.deepEqual(index_1.toJson(index_1.default.string().max(10)), { "type": "string", "max": 10 });
        done();
    });
    it("max with options", function (done) {
        assert.deepEqual(index_1.toJson(index_1.default.string().max(10, "UTF8")), { "type": "string", "max": { limit: 10, encoding: "UTF8" } });
        done();
    });
    it("multiple", function (done) {
        assert.deepEqual(index_1.toJson(index_1.default.number().multiple(10)), { "type": "number", "multiple": 10 });
        done();
    });
    it("less", function (done) {
        assert.deepEqual(index_1.toJson(index_1.default.number().less(10)), { "type": "number", "less": 10 });
        done();
    });
    it("greater", function (done) {
        assert.deepEqual(index_1.toJson(index_1.default.number().greater(10)), { "type": "number", "greater": 10 });
        done();
    });
    it("greater - reference", function (done) {
        assert.deepEqual(index_1.toJson(index_1.default.number().greater(index_1.default.ref("/a", {
            adjust: function (value) { return value + 1; }
        }))), {
            "type": "number", "greater": {
                $ref: "a",
                adjust: "function (value) { return value + 1; }",
                ancestor: "root",
                in: false,
                iterables: null,
                map: null
            }
        });
        done();
    });
    it("precision", function (done) {
        assert.deepEqual(index_1.toJson(index_1.default.number().precision(10)), { "type": "number", "precision": 10 });
        done();
    });
    it("positive", function (done) {
        assert.deepEqual(index_1.toJson(index_1.default.number().positive()), { "type": "number", "positive": true });
        done();
    });
    it("regex", function (done) {
        assert.deepEqual(index_1.toJson(index_1.default.string().replace(/a/gi, "b")), { "type": "string", "replace": [{ find: { $regex: "a", flags: "gi" }, replace: "b" }] });
        done();
    });
    it("regex - array", function (done) {
        assert.deepEqual(index_1.toJson(index_1.default.string().replace(/a/gi, "b").replace("a", "b")), {
            "type": "string",
            "replace": [
                { find: { $regex: "a", flags: "gi" }, replace: "b" },
                { find: { $regex: "a", flags: "g" }, replace: "b" }
            ]
        });
        done();
    });
    it("allow", function (done) {
        assert.deepEqual(index_1.toJson(index_1.default.string().allow(null)), {
            "type": "string",
            allow: [null]
        });
        done();
    });
    it("valid", function (done) {
        assert.deepEqual(index_1.toJson(index_1.default.string().valid(null)), {
            "type": "string",
            valid: [null]
        });
        done();
    });
});
