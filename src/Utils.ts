import * as Joi from "joi";
import {JsonRegex, Reference} from "./Interfaces";
import {fromJson} from "./index";

export function isObject(obj: any): boolean {
  return obj !== null && typeof obj === "object" && !Array.isArray(obj);
}

export function isStringFunction(str: string): boolean {
  if (typeof str === "string")
    return str.startsWith("(") || str.startsWith("function");
  return false;
}

export const isFunction = (fn: any) => typeof fn === "function";

export function regexToString(regex: RegExp): JsonRegex {
  const str: string = regex.toString();
  const lastSlash: number = str.lastIndexOf("/");
  const output: JsonRegex = {
    $regex: str.substr(1, lastSlash - 1)
  };
  if (str.length > (lastSlash + 1))
    output.flags = str.substr(lastSlash + 1, 10);
  return output;
}

export function jsonToRegex(regex: any) {
  if (isObject(regex) && "$regex" in regex) {
    if ("flags" in regex)
      return new RegExp(regex["$regex"], regex.flags);
    return new RegExp(regex["$regex"]);
  }
  return new RegExp(regex);
}

export function jsonToRef(ref: any) {
  if (isObject(ref) && "$ref" in ref)  {
    const _ref = ref["$ref"];
    delete ref["$ref"];
    if ("adjust" in ref)
      ref.adjust = eval(ref.adjust);
    return Joi.ref(_ref, ref);
  }
  return ref;
}

export function extractRef(obj: any) {
  if (!isObject(obj) || !obj.hasOwnProperty("key"))
    return obj;
  const ref: Reference = {
    $ref: obj.key,
    // map: obj.map,
    // prefix: obj.prefix,
    // ancestor: obj.ancestor,
    // in: obj.in,
    // iterables: obj.iterables
  };
  ["map", "prefix", "ancestor", "in", "iterables", "adjust"].forEach(k => {
    if (obj.hasOwnProperty(k))
      (ref as any)[k] = k === "adjust" && isFunction(obj[k]) ? obj[k].toString() : obj[k];
  });
  return ref;
}

export function propertiesToJson(properties: any) {
  let joi: Record<string, Joi.Schema> = {};
  for (let key in properties)  {
    joi[key] = fromJson(properties[key]);
  }
  return joi;
}