import * as assert from 'assert';
import JsonJoi, { fromJson, toJson } from '../index';

describe('Joi to Json - binary', () => {

  it('toJson', (done) => {
    assert.deepEqual(
      toJson(JsonJoi.binary()),
      {
        type: 'binary'
      }
    );
    done();
  });

  it('fromJson', (done) => {
    assert.deepEqual(
      toJson(fromJson(toJson(JsonJoi.binary()))),
      {
        type: 'binary'
      }
    );
    done();
  });

  it('toJson - object', (done) => {
    assert.deepEqual(
      toJson(JsonJoi.object({
        file: JsonJoi.binary()
      })),
      {
        type: 'object',
        properties: {
          file: {
            type: 'binary'
          }
        }
      }
    );
    done();

  });

});
