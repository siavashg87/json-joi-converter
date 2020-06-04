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
        done();
    });
    it("when", function (done) {
        index_1.fromJson({
            type: "array",
            when: {
                reference: "/type",
                is: {
                    valid: [1, 2, true]
                },
                then: {
                    type: "array",
                    min: 1
                },
                otherwise: {
                    reference: "/type",
                    is: "A",
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
    it("regex", function (done) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        var json = {
            type: "object",
            properties: {
                a: {
                    type: "string",
                    pattern: "/a/"
                },
                b: {
                    type: "string",
                    regex: { $regex: "/a/", flags: "i" }
                },
                c: {
                    type: "string",
                    regex: { pattern: { $regex: "/a/" } }
                }
            }
        };
        var converted = index_1.toJson(index_1.fromJson(json));
        assert.equal((_d = (_c = (_b = (_a = converted.properties) === null || _a === void 0 ? void 0 : _a.a) === null || _b === void 0 ? void 0 : _b.pattern) === null || _c === void 0 ? void 0 : _c.regex) === null || _d === void 0 ? void 0 : _d.$regex, '\\/a\\/');
        assert.equal((_h = (_g = (_f = (_e = converted.properties) === null || _e === void 0 ? void 0 : _e.b) === null || _f === void 0 ? void 0 : _f.pattern) === null || _g === void 0 ? void 0 : _g.regex) === null || _h === void 0 ? void 0 : _h.$regex, '\\/a\\/');
        assert.equal((_m = (_l = (_k = (_j = converted.properties) === null || _j === void 0 ? void 0 : _j.b) === null || _k === void 0 ? void 0 : _k.pattern) === null || _l === void 0 ? void 0 : _l.regex) === null || _m === void 0 ? void 0 : _m.flags, 'i');
        assert.equal((_r = (_q = (_p = (_o = converted.properties) === null || _o === void 0 ? void 0 : _o.c) === null || _p === void 0 ? void 0 : _p.pattern) === null || _q === void 0 ? void 0 : _q.regex) === null || _r === void 0 ? void 0 : _r.$regex, '\\/a\\/');
        done();
    });
    it("replace", function (done) {
        var _a, _b, _c, _d;
        var json = {
            type: "string",
            replace: { find: { $regex: "a", flags: "i" }, replace: "b" }
        };
        var converted = index_1.toJson(index_1.fromJson(json));
        assert.equal((_b = (_a = converted.replace[0]) === null || _a === void 0 ? void 0 : _a.find) === null || _b === void 0 ? void 0 : _b.$regex, 'a');
        assert.equal((_d = (_c = converted.replace[0]) === null || _c === void 0 ? void 0 : _c.find) === null || _d === void 0 ? void 0 : _d.flags, 'i');
        done();
    });
    it("array - items - object", function (done) {
        var json = {
            type: "array",
            items: {
                type: "number",
                min: 3
            }
        };
        var converted = index_1.toJson(index_1.fromJson(json));
        assert.equal(converted.items.type, "number");
        done();
    });
    it("array - items - array - object", function (done) {
        var json = {
            type: "array",
            items: [
                {
                    type: "number",
                    min: 3
                },
                {
                    type: "string"
                }
            ]
        };
        var converted = index_1.toJson(index_1.fromJson(json));
        assert.equal(converted.items.length, 2);
        assert.equal(converted.items[0].type, "number");
        assert.equal(converted.items[0].min, 3);
        assert.equal(converted.items[1].type, "string");
        done();
    });
    it("array - ordered", function (done) {
        var json = {
            type: "array",
            ordered: [
                {
                    type: "number",
                    min: 3,
                    required: true
                },
                {
                    type: "string"
                }
            ]
        };
        var converted = index_1.toJson(index_1.fromJson(json));
        assert.equal(converted.ordered.length, 2);
        assert.equal(converted.ordered[0].type, "number");
        assert.equal(converted.ordered[0].required, true);
        assert.equal(converted.ordered[0].min, 3);
        assert.equal(converted.ordered[1].type, "string");
        done();
    });
});
