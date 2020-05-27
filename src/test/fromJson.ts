import * as assert from "assert";
import JsonJoi, {fromJson, ObjectSchema, toJson} from "../index";

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

    fromJson({
      type: "array",
      when: {
        reference: "/type",
        is: {
          valid: [1, 2, true]
        },
        then: {
          min: 1
        },
        otherwise: {
          is: 1,
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

});
