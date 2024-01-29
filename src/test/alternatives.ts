import * as assert from 'assert';
import JsonJoi, { fromJson, toJson } from '../index';

describe('Joi to Json - alternatives', () => {

  it('toJson', (done) => {
    assert.deepEqual(
      toJson(fromJson(toJson(JsonJoi.alternatives().match('all').try(JsonJoi.number().min(1), JsonJoi.string().valid('a'))))),
      {
        type: 'alternatives',
        try: [
          {
            min: 1,
            type: 'number'
          },
          {
            type: 'string',
            valid: ['a']
          }
        ],
        match: 'all'
      }
    );
    done();
  });

});
