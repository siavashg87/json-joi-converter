import * as assert from 'assert';
import JsonJoi, { toJson } from '../index';

describe('Joi to Json - meta', () => {

  it('meta', (done) => {
    assert.deepEqual(
      toJson(JsonJoi.string().meta({ test: true })),
      {
        meta: { test: true },
        type: 'string'
      }
    );
    done();
  });

  it('meta object', (done) => {
    assert.deepEqual(
      toJson(JsonJoi.object({
        test: JsonJoi.string().meta({ test: true })
      })),
      {
        type: 'object',
        properties: {
          test: {
            meta: { test: true },
            type: 'string'
          }
        }
      }
    );
    done();
  });

});
