import * as assert from 'assert';
import JsonJoi, { fromJson, toJson } from '../index';

describe('Joi to Json', () => {

  it('regex', (done) => {
    assert.deepEqual(
      toJson(JsonJoi.string().regex(new RegExp(/^[\d]{4}-[\d]{2}-[\d]{2}$/))),
      {
        pattern: {
          options: {},
          regex: {
            '$regex': '/(?=.*[A-Z])(?=.*[\\.!@#$&*])(?=.*[0-9])(?=.*[a-z])./'
          }
        },
        type: 'string'
      }
    );
    done();
  });

  it('regex', (done) => {
    assert.deepEqual(
      toJson(fromJson(toJson(JsonJoi.string().regex(new RegExp(/^[\d]{4}-[\d]{2}-[\d]{2}$/im))))),
      {
        pattern: {
          options: {},
          regex: {
            '$regex': '^[\\d]{4}-[\\d]{2}-[\\d]{2}$',
            flags: 'im'
          }
        },
        type: 'string'
      }
    );
    done();
  });

});
