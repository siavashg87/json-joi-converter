import * as Joi from "@hapi/joi";
import { Schema } from "./Interfaces";
export declare function fromJson(json: any): Joi.Schema;
export declare function toJson(joi: any): Schema;
export { Schema };
export default Joi;
