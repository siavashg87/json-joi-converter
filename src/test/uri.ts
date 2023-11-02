import * as assert from 'assert';
import JsonJoi, { toJson } from '../index';

describe('Joi to Json - uri', () => {

  it('uri', (done) => {
    assert.deepEqual(
      toJson(JsonJoi.string().uri()),
      {
        type: 'string',
        uri: true
      }
    );
    done();
  });

  it('uri - scheme', (done) => {
    assert.deepEqual(
      toJson(JsonJoi.string().uri({ scheme: ['https'] })),
      {
        type: 'string',
        uri: {
          scheme: ['https']
        }
      }
    );
    done();
  });

});
