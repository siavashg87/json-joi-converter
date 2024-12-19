import * as joi from 'joi';
import {
  Schema,
  AnySchema,
  ObjectSchema,
  StringSchema,
  ArraySchema,
  AlternativesSchema,
  BinarySchema,
  BooleanSchema,
  DateSchema,
  NumberSchema,
  LinkSchema,
  SymbolSchema
} from './interfaces';

import { fromJson } from './from.json';
import { toJson } from './to.json';

export {
  Schema,
  AnySchema,
  ObjectSchema,
  StringSchema,
  ArraySchema,
  AlternativesSchema,
  BinarySchema,
  BooleanSchema,
  DateSchema,
  NumberSchema,
  LinkSchema,
  SymbolSchema,
  joi,
  fromJson,
  toJson
};
export default joi;
