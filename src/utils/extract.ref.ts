import { Reference } from '../interfaces';
import { isFunction } from './is.function';
import { isObject } from './is.object';

export function extractRef(obj: any) {
  if (!isObject(obj) || !obj.hasOwnProperty('key'))
    return obj;

  const ref: Reference = {
    $ref: obj.key,
    // map: obj.map,
    // prefix: obj.prefix,
    // ancestor: obj.ancestor,
    // in: obj.in,
    // iterables: obj.iterables
  };

  ['map', 'prefix', 'in', 'iterables', 'adjust'].forEach(k => {
    if (obj[k])
      (ref as any)[k] = k === 'adjust' && isFunction(obj[k]) ? obj[k].toString() : obj[k];
  });
  return ref;
}
