import * as assert from 'assert';
import JsonJoi, { fromJson, toJson } from '../src';

describe('Joi to Json - boolean', () => {

  it('date - min date', (done) => {
    assert.deepEqual(
      toJson(JsonJoi.bool().truthy("Y").falsy("N")),
      {
        type: "boolean",
        falsy: ["N"],
        truthy: ["Y"]
      }
    );
    done();
  });

});
