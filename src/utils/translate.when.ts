import * as Joi from 'joi';
import { fromJson } from '../index';
import { TypeWhen } from '../interfaces';
import { jsonToRef } from './json.to.ref';

export function translateWhen(when: any, validation: Joi.Schema | null = null): Joi.Schema {
  if (!validation)
    validation = Joi.any();

  let ref = null;

  if ('reference' in when) {
    ref = jsonToRef(when.reference);
    delete when.reference;
  }
  else if ('schema' in when) {
    ref = fromJson(when.schema);
    delete when.schema;
  }

  if ('is' in when)
    when.is = fromJson(when.is);

  if ('then' in when)
    when.then = fromJson(when.then);

  if ('otherwise' in when)
    when.otherwise = fromJson(when.otherwise);

  if ('switch' in when)
    when.switch = when.switch.map((sw: any) => {
      let op: TypeWhen = {} as TypeWhen;

      if ('then' in when)
        op.then = fromJson(sw.then);

      if ('otherwise' in when)
        op.otherwise = fromJson(sw.otherwise);

      return op;
    });

  validation = validation.when(ref, when);

  return validation;
}
