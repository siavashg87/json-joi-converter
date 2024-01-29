import { ObjectSchema, Schema, TypeReplace } from './interfaces';
import * as Joi from 'joi';
import { cloneDeep, isObject, isStringFunction, jsonToRef, jsonToRegex, propertiesToJson, translateWhen } from './utils';

let OptionKey: any = {
  example: 'example',
  external: 'method',
  length: 'limit',
  max: 'limit',
  min: 'limit',
  pattern: 'pattern',
  regex: 'pattern',
};

export function fromJson(_json: Schema): Joi.Schema {
  const json: any = cloneDeep(_json);

  if (isObject(json) && 'then' in json)
    return translateWhen(json);

  if (!isObject(json) || !('type' in json))
    return json;

  let validation: any = json.type === 'object' ? Joi.object(propertiesToJson((json as ObjectSchema).properties)) : (Joi as any)[json.type || 'any']();

  for (let k in json) {

    switch (k) {
    case 'type':
    case 'properties':
      break;
      // no arguments
    case 'exist':
    case 'forbidden':
    case 'keep':
    case 'optional':
    case 'required':
    case 'warn':
    case 'warning':
    case 'integer':
    case 'negative':
    case 'port':
    case 'positive':
    case 'alphanum':
    case 'creditCard':
    case 'hostname':
    case 'insensitive':
    case 'isoDate':
    case 'isoDuration':
    case 'lowercase':
    case 'token':
    case 'uppercase':
    case 'iso':
      validation = validation[k]();
      break;

      // single/no argument
    case 'empty':
    case 'base64':
    case 'dataUri':
    case 'domain':
    case 'email':
    case 'guid':
    case 'hex':
    case 'ip':
    case 'normalize':
    case 'uri':
    case 'uuid':
    case 'schema':
    case 'sort':
      if (k === 'uri' && isObject(json[k]) && 'scheme' in json[k])
        json[k].scheme = Array.isArray(json[k].scheme) ? json[k].scheme.map((o: any) => jsonToRegex(o)) : jsonToRegex(json[k].schema);

      validation = json[k] === true ? validation[k]() : validation[k](json[k]);
      break;

      // single argument
    case 'alter':
    case 'cast':
    case 'concat':
    case 'default':
    case 'description':
    case 'equal':
    case 'extract':
    case 'failover':
    case 'id':
    case 'label':
    case 'message':
    case 'messages':
    case 'meta':
    case 'note':
    case 'only':
    case 'options':
    case 'prefs':
    case 'preferences':
    case 'presence':
    case 'raw':
    case 'rule':
    case 'shared':
    case 'strict':
    case 'strip':
    case 'tag':
    case 'tailor':
    case 'unit':
    case 'falsy':
    case 'sensitive':
    case 'truthy':
    case 'greater':
    case 'less':
    case 'multiple':
    case 'precision':
    case 'sign':
    case 'unsafe':
    case 'case':
    case 'trim':
    case 'truncate':
    case 'append':
    case 'keys':
    case 'unknown':
    case 'has':
    case 'single':
    case 'sparse':
    case 'encoding':
    case 'timetamp':
    case 'match':
    case 'min':
    case 'max':
    case 'length':
    case 'map': {
      let arg = json[k];

      if (['default', 'multiple', 'less', 'max', 'min', 'greater', 'length'].includes(k)) {
        if (isObject(arg) && !('$ref' in arg)) {
          if ('limit' in arg)
            arg.limit = jsonToRef(arg.limit);
          else if ('base' in arg)
            arg.base = jsonToRef(arg.base);
        }
        else
          arg = jsonToRef(arg);
      }

      validation = validation[k](arg);
    }
      break;

    case 'error':
      validation = validation.error(new Error(json[k]));
      break;

      // with options
    case 'example':
    case 'external':
    case 'fork': {
      let arg1, arg2, key = OptionKey[k] || k;

      if (isObject(json[k]) && key in (json[k] as any)) {
        arg1 = json[k][key];
        delete json[k][key];
        arg2 = json[k][key];
      }
      else
        arg1 = json[k];

      if (k === 'external')
        arg1 = eval(arg1);

      // @ts-ignore
      validation = arg2 !== undefined ? validation[k](arg1, arg2) : validation[k](arg1);
      break;
    }

    // spread
    case 'allow':
    case 'disallow':
    case 'not':
    case 'valid':
    case 'invalid':
      validation = validation[k](...(Array.isArray(json[k]) ? json[k] : [json[k]]).map((v: any) => jsonToRef(v)));
      break;

    case 'items':
    case 'ordered':
    case 'try':
      validation = validation[k](...(Array.isArray(json[k]) ? json[k] : [json[k]]).map((j: Schema) => fromJson(j)));
      break;

      // peers
    case 'and':
    case 'nand':
    case 'or':
    case 'oxor':
    case 'xor':
      let args;

      if (isObject(json[k])) {
        if ('options' in json[k])
          args = [...json[k].peers, json[k].options];
        else
          args = json[k].peers;
      }
      else
        args = json[k];

      validation = validation[k](...args);
      break;

      // with options property
    case 'pattern':
    case 'regex': {

      if (json[k].type === 'object')
        validation = (validation as Joi.ObjectSchema).regex();
      else {
        let arg1, arg2, arg3, key = OptionKey[k] || k;

        if (isObject(json[k]) && key in json[k]) {
          arg1 = json[k][key];
          arg2 = json[k].options;
          // object pattern
          arg3 = json[k].schema;
        }
        else
          arg1 = json[k];

        arg1 = jsonToRegex(arg1);

        validation = arg3 !== undefined ? validation[k](arg1, arg3, arg2) : (arg2 !== undefined ? validation[k](arg1, arg2) : validation[k](arg1));
      }

      break;
    }

    case 'unique':
      if (json[k] === true)
        validation = validation[k]();

      else {
        let comparator: any, options = {};

        if (isObject(json[k])) {
          if ('comparator' in json[k])
            comparator = json[k].comparator;

          if ('options' in json[k])
            options = json[k].options;
        }
        else
          comparator = json[k];

        if (isStringFunction(comparator))
          comparator = eval(comparator);

        validation = validation[k](comparator, options);
      }

      break;

    case 'rename':
      const from: string = json[k].from;
      const to: string = json[k].to;

      delete json[k].from;
      delete json[k].to;
      validation = validation[k](from, to, json[k]);
      break;

    case 'replace':
      (Array.isArray(json[k]) ? json[k] : [json[k]]).forEach((r: TypeReplace) => {
        validation = validation[k](jsonToRegex(r.find), r.replace);
      });
      break;

    case 'assert':
      let reference, schema, message;

      if (isObject(json[k])) {
        reference = json[k].reference;
        schema = json[k].schema;
        message = json[k].message;
      }
      else if (Array.isArray(json[k]))
        [reference, schema, message] = json[k];

      reference = jsonToRef(reference);

      validation = message !== undefined ? validation[k](reference, schema, message) : validation[k](reference, schema);

      break;

    case 'with':
    case 'without': {
      let key, peers, options;

      if (isObject(json[k])) {
        key = json[k].key;
        peers = json[k].peers;
        options = json[k].options;
      }
      else if (Array.isArray(json[k]))
        [key, peers, options] = json[k];

      validation = message !== undefined ? validation[k](key, peers, options) : validation[k](key, peers);

    }
      break;

    case 'when':
    case 'conditional':
      (Array.isArray(json[k]) ? json[k] : [json[k]]).forEach((when: any) => {
        validation = translateWhen(when, validation);
      });
      break;
    default:
      throw new Error(`Validation "${k}" not found!`);
    }
  }
  return validation;
}
