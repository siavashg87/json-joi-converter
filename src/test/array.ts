import JsonJoi, { fromJson, toJson } from '../index';

describe('Joi to Json - Array', () => {

  it('array', (done) => {
    const original_schema = JsonJoi.object({
      a: JsonJoi.string(),
      b: JsonJoi.array().min(1).when('a', { is: 'a', then: JsonJoi.array().min(2).required() })
    });
    const json_schema = toJson(original_schema);
    const schema = fromJson(json_schema);

    schema.validate({ a: 'a', b: [1] });
    done();
  });

});
