import * as assert from 'assert';
import { ArraySchema, fromJson, ObjectSchema, StringSchema, toJson } from '../index';

describe('Json to Joi', () => {
  it('simple number', (done) => {
    let json: ObjectSchema = {
      type: 'object',
      properties: {
        a: {
          type: 'number',
          min: 100,
          max: 1000
        }
      }
    };

    assert.deepEqual(
      toJson(fromJson(json)),
      json
    );
    done();
  });

  it('assert', (done) => {
    let json: ObjectSchema = {
      type: 'object',
      assert: ['a', 'b', 'c'],
      properties: {
        a: {
          type: 'number',
          min: 100,
          max: 1000
        }
      }
    };

    assert.deepEqual(
      Object.keys((toJson(fromJson(json)) as any).assert),
      ['subject', 'schema', 'message']
    );

    done();
  });

  it('when', (done) => {
    fromJson({
      type: 'array',
      when: {
        reference: '/type',
        is: {
          valid: [1, 2, true]
        },
        then: {
          type: 'array',
          min: 1
        },
        otherwise: {
          reference: '/type',
          is: 'A',
          then: {
            length: 2
          },
          otherwise: {
            min: 0
          }
        }
      }
    });
    done();
  });

  it('regex', (done) => {
    let json: ObjectSchema = {
      type: 'object',
      properties: {
        a: {
          type: 'string',
          pattern: '/a/'
        },
        b: {
          type: 'string',
          regex: { $regex: '/a/', flags: 'i' }
        },
        c: {
          type: 'string',
          regex: { pattern: { $regex: '/a/' } }
        }
      }
    };

    const converted = (toJson(fromJson(json)) as any);

    assert.equal(converted.properties?.a?.pattern?.regex?.$regex, '\\/a\\/');
    assert.equal(converted.properties?.b?.pattern?.regex?.$regex, '\\/a\\/');
    assert.equal(converted.properties?.b?.pattern?.regex?.flags, 'i');
    assert.equal(converted.properties?.c?.pattern?.regex?.$regex, '\\/a\\/');

    done();
  });

  it('replace', (done) => {
    let json: StringSchema = {
      type: 'string',
      replace: { find: { $regex: 'a', flags: 'i' }, replace: 'b' }
    };

    const converted = (toJson(fromJson(json)) as any);

    assert.equal(converted.replace[0]?.find?.$regex, 'a');
    assert.equal(converted.replace[0]?.find?.flags, 'i');

    done();
  });

  it('array - items - object', (done) => {
    let json: ArraySchema = {
      type: 'array',
      items: {
        type: 'number',
        min: 3
      }
    };

    const converted = (toJson(fromJson(json)) as any);

    assert.equal(converted.items.type, 'number');

    done();
  });

  it('array - items - array - object', (done) => {
    let json: ArraySchema = {
      type: 'array',
      items: [
        {
          type: 'number',
          min: 3
        },
        {
          type: 'string'
        }
      ]
    };

    const converted = (toJson(fromJson(json)) as any);

    assert.equal(converted.items.length, 2);
    assert.equal(converted.items[0].type, 'number');
    assert.equal(converted.items[0].min, 3);
    assert.equal(converted.items[1].type, 'string');

    done();
  });

  it('array - ordered', (done) => {
    let json: ArraySchema = {
      type: 'array',
      ordered: [
        {
          type: 'number',
          min: 3,
          required: true
        },
        {
          type: 'string'
        }
      ]
    };

    const converted = (toJson(fromJson(json)) as any);

    assert.equal(converted.ordered.length, 2);
    assert.equal(converted.ordered[0].type, 'number');
    assert.equal(converted.ordered[0].required, true);
    assert.equal(converted.ordered[0].min, 3);
    assert.equal(converted.ordered[1].type, 'string');

    done();
  });

  it('array - single', (done) => {
    let json: ArraySchema = {
      type: 'array',
      items: [
        {
          type: 'number',
          min: 3,
          required: true
        }
      ],
      single: true
    };

    const converted = (toJson(fromJson(json)) as any);

    assert.equal(converted.single, true);

    done();
  });

  it('array - sparse', (done) => {
    let json: ArraySchema = {
      type: 'array',
      items: [
        {
          type: 'number',
          min: 3,
          required: true
        }
      ],
      sparse: true
    };

    const converted = (toJson(fromJson(json)) as any);

    assert.equal(converted.sparse, true);

    done();
  });

  it('array - unique', (done) => {
    let json: ArraySchema = {
      type: 'array',
      items: [
        {
          type: 'number',
          min: 3,
          required: true
        }
      ],
      unique: true
    };

    const converted = (toJson(fromJson(json)) as any);

    assert.deepEqual(converted.unique, { options: {} });

    done();
  });

  it('array - unique - options', (done) => {
    let json: ArraySchema = {
      type: 'array',
      items: [
        {
          type: 'number',
          min: 3,
          required: true
        }
      ],
      unique: {
        options: {
          ignoreUndefined: true
        }
      }
    };

    const converted = (toJson(fromJson(json)) as any);

    assert.deepEqual(converted.unique, { options: { ignoreUndefined: true } });

    done();
  });

  it('array - unique - string', (done) => {
    let json: ArraySchema = {
      type: 'array',
      items: [
        {
          type: 'number',
          min: 3,
          required: true
        }
      ],
      unique: 'customer.id'
    };

    const converted = (toJson(fromJson(json)) as any);

    assert.deepEqual(converted.unique, { comparator: 'customer.id', options: {} });

    done();
  });

  it('array - unique - function', (done) => {
    let json: ArraySchema = {
      type: 'array',
      items: [
        {
          type: 'number',
          min: 3,
          required: true
        }
      ],
      unique: '(a, b) => a.property === b.property'
    };

    const converted = (toJson(fromJson(json)) as any);

    assert.deepEqual(converted.unique, { comparator: '(a, b) => a.property === b.property', options: {} });

    done();
  });

});
