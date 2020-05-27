import * as assert from "assert";
import JsonJoi, {fromJson, toJson} from "../index";

describe('Json to Joi', () => {
  it("simple number", (done) => {
    let json = {
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
    let json = {
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

});
