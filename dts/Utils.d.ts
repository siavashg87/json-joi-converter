import * as Joi from "@hapi/joi";
import { JsonRegex } from "./Interfaces";
export declare function isObject(obj: any): boolean;
export declare const isFunction: (fn: any) => boolean;
export declare function regexToString(regex: RegExp): JsonRegex;
export declare function jsonToRegex(regex: any): RegExp;
export declare function jsonToRef(ref: any): any;
export declare function extractRef(obj: any): any;
export declare function propertiesToJson(properties: any): Record<string, Joi.Schema>;
