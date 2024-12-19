import * as assert from 'assert';
import JsonJoi, { fromJson, toJson } from '../src';

describe('Joi to Json - Precision - Strict/Convert', () => {

  it('precision', (done) => {
    const original_schema = JsonJoi.number().precision(5);
    const json_schema = toJson(original_schema);
    const schema = fromJson(json_schema);

    assert.equal(json_schema.precision, 5);
    const result = schema.validate(5.123456);

    assert.equal(result.value, 5.12346);
    const schemaStrict = fromJson({ ...json_schema, strict: true });
    const resultStrict = schemaStrict.validate(5.123456);

    assert.equal(!!resultStrict.error, true);
    const resultStrict2 = schemaStrict.validate(5.12345);

    assert.equal(resultStrict2.value, 5.12345);
    assert.equal(toJson(schemaStrict).strict, true);

    done();
  });

});
