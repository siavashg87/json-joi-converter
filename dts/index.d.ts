import * as Joi from "@hapi/joi";
import { Schema, AnySchema, ObjectSchema, StringSchema, ArraySchema, AlternativesSchema, BinarySchema, BooleanSchema, DateSchema, NumberSchema, LinkSchema, SymbolSchema } from "./Interfaces";
export declare function fromJson(_json: Schema): Joi.Schema;
export declare function toJson(joi: any): Schema;
export { Schema, AnySchema, ObjectSchema, StringSchema, ArraySchema, AlternativesSchema, BinarySchema, BooleanSchema, DateSchema, NumberSchema, LinkSchema, SymbolSchema };
export default Joi;
