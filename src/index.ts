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
  SymbolSchema,
  TypeWhen,
  JsonRegex,
} from './interfaces';

import { fromJson, } from './from.json';
import { toJson, } from './to.json';

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
  TypeWhen,
  JsonRegex,
  joi,
  fromJson,
  toJson,
};
export default joi;
