import * as assert from 'assert';
import JsonJoi, { toJson } from '../index';

describe('Joi to Json- toJson', () => {

  it('email', (done) => {
    assert.deepEqual(
      toJson(JsonJoi.string().email()),
      { 'type': 'string', 'email': true }
    );
    done();
  });

  it('email with options', (done) => {
    assert.deepEqual(
      toJson(JsonJoi.string().email({
        allowUnicode: true
      })),
      {
        'type': 'string', 'email': {
          allowUnicode: true
        }
      }
    );
    done();
  });

  it('email - min', (done) => {
    assert.deepEqual(
      toJson(JsonJoi.string().email({
        allowUnicode: true
      }).min(10)),
      {
        'type': 'string',
        'email': {
          allowUnicode: true
        },
        'min': 10
      }
    );
    done();
  });

  it('dataUri', (done) => {
    assert.deepEqual(
      toJson(JsonJoi.string().dataUri()),
      { 'type': 'string', 'dataUri': { paddingRequired: true } }
    );
    done();
  });

  it('dataUri with options', (done) => {
    assert.deepEqual(
      toJson(JsonJoi.string().dataUri({ paddingRequired: false })),
      { 'type': 'string', 'dataUri': { paddingRequired: false } }
    );
    done();
  });

  it('domain', (done) => {
    assert.deepEqual(
      toJson(JsonJoi.string().domain()),
      { 'type': 'string', 'domain': true }
    );
    done();
  });

  it('domain with options', (done) => {
    assert.deepEqual(
      toJson(JsonJoi.string().domain({ allowUnicode: true })),
      { 'type': 'string', 'domain': { allowUnicode: true } }
    );
    done();
  });

  it('guid', (done) => {
    assert.deepEqual(
      toJson(JsonJoi.string().guid()),
      { 'type': 'string', 'guid': true }
    );
    done();
  });

  it('guid with options', (done) => {
    assert.deepEqual(
      toJson(JsonJoi.string().guid({ version: ['uuidv1', 'uuidv2'] })),
      { 'type': 'string', 'guid': { version: ['uuidv1', 'uuidv2'] } }
    );
    done();
  });

  it('hex', (done) => {
    assert.deepEqual(
      toJson(JsonJoi.string().hex()),
      { 'type': 'string', 'hex': { byteAligned: false, prefix: false } }
    );
    done();
  });

  it('hex with options', (done) => {
    assert.deepEqual(
      toJson(JsonJoi.string().hex({ byteAligned: true })),
      { 'type': 'string', 'hex': { byteAligned: true, prefix: false } }
    );
    done();
  });

  it('min', (done) => {
    assert.deepEqual(
      toJson(JsonJoi.string().min(10)),
      { 'type': 'string', 'min': 10 }
    );
    assert.deepEqual(
      toJson(JsonJoi.number().min(10)),
      { 'type': 'number', 'min': 10 }
    );
    done();
  });

  it('min with options', (done) => {
    assert.deepEqual(
      toJson(JsonJoi.string().min(10, 'UTF8')),
      { 'type': 'string', 'min': { limit: 10, encoding: 'UTF8' } }
    );
    done();
  });

  it('max', (done) => {
    assert.deepEqual(
      toJson(JsonJoi.string().max(10)),
      { 'type': 'string', 'max': 10 }
    );
    done();
  });

  it('max with options', (done) => {
    assert.deepEqual(
      toJson(JsonJoi.string().max(10, 'UTF8')),
      { 'type': 'string', 'max': { limit: 10, encoding: 'UTF8' } }
    );
    done();
  });

  it('multiple', (done) => {
    assert.deepEqual(
      toJson(JsonJoi.number().multiple(10)),
      { 'type': 'number', 'multiple': {base: 10, baseDecimalPlace: 0, pfactor: 1 } }
    );
    done();
  });

  it('less', (done) => {
    assert.deepEqual(
      toJson(JsonJoi.number().less(10)),
      { 'type': 'number', 'less': 10 }
    );
    done();
  });

  it('greater', (done) => {
    assert.deepEqual(
      toJson(JsonJoi.number().greater(10)),
      { 'type': 'number', 'greater': 10 }
    );
    done();
  });

  it('greater - reference', (done) => {
    assert.deepEqual(
      toJson(JsonJoi.number().greater(JsonJoi.ref('/a', {
        //adjust: value => value + 1
      }))),
      {
        'type': 'number', 'greater': {
          $ref: 'a',
          // adjust: 'function (value) { return value + 1; }',
          adjust: null,
          ancestor: 'root',
          in: false,
          iterables: null,
          map: null
        }
      }
    );
    done();
  });

  it('precision', (done) => {
    assert.deepEqual(
      toJson(JsonJoi.number().precision(10)),
      { 'type': 'number', 'precision': 10 }
    );
    done();
  });

  it('positive', (done) => {
    assert.deepEqual(
      toJson(JsonJoi.number().positive()),
      { 'type': 'number', 'positive': true }
    );
    done();
  });

  it('regex', (done) => {
    assert.deepEqual(
      toJson(JsonJoi.string().replace(/a/gi, 'b')),
      { 'type': 'string', 'replace': [{ find: { $regex: 'a', flags: 'gi' }, replace: 'b' }] }
    );
    done();
  });

  it('regex - array', (done) => {
    assert.deepEqual(
      toJson(JsonJoi.string().replace(/a/gi, 'b').replace('a', 'b')),
      {
        'type': 'string',
        'replace': [
          { find: { $regex: 'a', flags: 'gi' }, replace: 'b' },
          { find: { $regex: 'a', flags: 'g' }, replace: 'b' }
        ]
      }
    );
    done();
  });

  it('allow', (done) => {
    assert.deepEqual(
      toJson(JsonJoi.string().allow(null)),
      {
        'type': 'string',
        allow: [null]
      }
    );
    done();
  });

  it('valid', (done) => {
    assert.deepEqual(
      toJson(JsonJoi.string().valid(null)),
      {
        'type': 'string',
        valid: [null]
      }
    );
    done();
  });

});
