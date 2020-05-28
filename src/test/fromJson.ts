import * as assert from "assert";
import JsonJoi, {fromJson, ObjectSchema, StringSchema, toJson} from "../index";

describe('Json to Joi', () => {
  it("simple number", (done) => {
    let json: ObjectSchema = {
      type: "object",
      properties: {
        a: {
          type: "number",
          min: 100,
          max: 1000
        }
      }
    };
    assert.deepEqual(
      toJson(fromJson(json)),
      json
    );
    done();
  });

  it("assert", (done) => {
    let json: ObjectSchema = {
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
    assert.deepEqual(
      Object.keys((toJson(fromJson(json)) as any).assert),
      ["subject", "schema", "message"]
    );

    done();
  });

  it("when", (done) => {
    fromJson({
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

  it("regex", (done) => {
    let json: ObjectSchema = {
      type: "object",
      properties: {
        a: {
          type: "string",
          pattern: "/a/"
        },
        b: {
          type: "string",
          regex: {$regex: "/a/", flags: "i"}
        },
        c: {
          type: "string",
          regex: {pattern: {$regex: "/a/"}}
        }
      }
    };

    const converted = (toJson(fromJson(json)) as any);

    assert.equal(converted.properties?.a?.pattern?.regex?.$regex, '\\/a\\/');
    assert.equal(converted.properties?.b?.pattern?.regex?.$regex, '\\/a\\/');
    assert.equal(converted.properties?.b?.pattern?.regex?.flags, 'i');
    assert.equal(converted.properties?.c?.pattern?.regex?.$regex, '\\/a\\/');

    done();
  });

  it("replace", (done) => {
    let json: StringSchema = {
      type: "string",
      replace: {find: {$regex: "a", flags: "i"}, replace: "b"}
    };

    const converted = (toJson(fromJson(json)) as any);

    assert.equal(converted.replace[0]?.find?.$regex, 'a');
    assert.equal(converted.replace[0]?.find?.flags, 'i');

    done();
  });

});
