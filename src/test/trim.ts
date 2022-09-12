import * as assert from "assert";
import JsonJoi, {fromJson, toJson} from "../index";

describe('Joi to Json - trim', () => {

  it("trim", (done) => {
    assert.deepEqual(
      toJson(JsonJoi.string().trim()),
      {
        type: 'string',
        trim: true
      }
    );
    done();
  });

  it("trim - from json", (done) => {
    assert.deepEqual(
      toJson(fromJson({
        type: 'string',
        trim: true
      })),
      {
        type: 'string',
        trim: true
      }
    );
    done();
  });

});
