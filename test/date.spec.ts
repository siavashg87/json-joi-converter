import * as assert from 'assert';
import JsonJoi, { fromJson, toJson } from '../src';

describe('Joi to Json - date', () => {

  it('date - min date', (done) => {
    assert.deepEqual(
      toJson(fromJson({
        type: 'object',
        properties: {
          birthdate: {
            type: "date",
            min: "1930-01-01T00:00:00.000Z",
            required: true
          },
        }
      })),
      {
        type: 'object',
        properties: {
          birthdate: {
            type: "date",
            min: "1930-01-01T00:00:00.000Z",
            required: true
          },
        }
      }
    );
    done();
  });

});
