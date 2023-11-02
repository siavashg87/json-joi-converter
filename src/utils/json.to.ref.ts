import * as Joi from 'joi';
import { isObject } from './is.object';

export function jsonToRef(ref: any) {
  if (isObject(ref) && '$ref' in ref) {
    const _ref = ref['$ref'];

    delete ref['$ref'];
    if ('adjust' in ref)
      ref.adjust = eval(ref.adjust);

    return Joi.ref(_ref, ref);
  }

  return ref;
}
