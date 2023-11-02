import * as Joi from 'joi';
import { fromJson } from '../index';

export function propertiesToJson(properties: any) {
  let joi: Record<string, Joi.Schema> = {};

  for (let key in properties) {
    joi[key] = fromJson(properties[key]);
  }
  return joi;
}
