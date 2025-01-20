import * as assert from 'assert';
import JsonJoi, { fromJson, toJson, } from '../src';

describe('Joi to Json - Array', () => {

  it('array', (done) => {
    const original_schema = JsonJoi.object({
      a: JsonJoi.string(),
      b: JsonJoi.array().min(1).when('a', { is: 'a', then: JsonJoi.array().min(2).required(), }),
    });
    const json_schema = toJson(original_schema);
    const schema = fromJson(json_schema);

    schema.validate({ a: 'a', b: [1,], });
    done();
  });

  it('array includes', (done) => {
    const original_schema = JsonJoi.object({
      a: JsonJoi.string().when('b', {
        is: JsonJoi.array().items(JsonJoi.string().valid('one').required(), JsonJoi.string()),
        then: JsonJoi.string().required(),
        otherwise: JsonJoi.string().forbidden(),
      }),
      b: JsonJoi.array().min(1),
    });
    const json_schema = toJson(original_schema);
    const schema = fromJson(json_schema);

    const result_success = schema.validate({ a: 'a', b: ['one',], });
    const result_success2 = schema.validate({ a: 'a', b: ['one', 'two',], });
    const result_fail = schema.validate({ a: 'a', b: ['two',], });

    assert.strictEqual(result_success.error, undefined);
    assert.strictEqual(result_success2.error, undefined);
    assert.strictEqual(!!result_fail.error, true);

    done();
  });

});
