import * as Joi from "joi";
import {cloneDeep} from "lodash";
import {isObject, regexToString, extractRef, jsonToRegex, jsonToRef, propertiesToJson, isStringFunction} from "./Utils";
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
  TypeReplace,
  TypeWhen
} from "./Interfaces";

let OptionKey: any = {
  example: "example",
  external: "method",
  length: "limit",
  max: "limit",
  min: "limit",
  pattern: "pattern",
  regex: "pattern",
};

function translateWhen(when: any, validation: Joi.Schema | null = null): Joi.Schema {
  if (!validation)
    validation = Joi.any();
  let ref = null;
  if ("reference" in when) {
    ref = jsonToRef(when.reference);
    delete when.reference;
  }
  else if ("schema" in when) {
    ref = fromJson(when.schema);
    delete when.schema;
  }
  if ("is" in when)
    when.is = fromJson(when.is);
  if ("then" in when)
    when.then = fromJson(when.then);
  if ("otherwise" in when)
    when.otherwise = fromJson(when.otherwise);

  if ("switch" in when)
    when.switch = when.switch.map((sw: any) => {
      let op: TypeWhen = {} as TypeWhen;
      if ("then" in when)
        op.then = fromJson(sw.then);
      if ("otherwise" in when)
        op.otherwise = fromJson(sw.otherwise);
      return op;
    });
  validation = validation.when(ref, when);

  return validation;
}


export function fromJson(_json: Schema): Joi.Schema {
  const json: any = cloneDeep(_json);
  if (isObject(json) && "then" in json)
    return translateWhen(json);
  if (!isObject(json) || !("type" in json))
    return json;
  let validation: any = json.type === "object" ? Joi.object(propertiesToJson((json as ObjectSchema).properties)) : (Joi as any)[json.type || "any"]();
  for (let k in json) {

    switch (k) {
      case "type":
      case "properties":
        break;
      // no arguments
      case "exist":
      case "forbidden":
      case "keep":
      case "optional":
      case "required":
      case "warn":
      case "warning":
      case "integer":
      case "negative":
      case "port":
      case "positive":
      case "alphanum":
      case "creditCard":
      case "hostname":
      case "insensitive":
      case "isoDate":
      case "isoDuration":
      case "lowercase":
      case "token":
      case "uppercase":
      case "iso":
        validation = validation[k]();
        break;

      // single/no argument
      case "empty":
      case "base64":
      case "dataUri":
      case "domain":
      case "email":
      case "guid":
      case "hex":
      case "ip":
      case "normalize":
      case "uri":
      case "uuid":
      case "schema":
      case "sort":
        if (k === "uri" && isObject(json[k]) && "scheme" in json[k])
          json[k].scheme = Array.isArray(json[k].scheme) ? json[k].scheme.map((o: any) => jsonToRegex(o)) : jsonToRegex(json[k].schema);
        validation = json[k] === true ? validation[k]() : validation[k](json[k]);
        break;

      // single argument
      case "alter":
      case "cast":
      case "concat":
      case "default":
      case "description":
      case "equal":
      case "extract":
      case "failover":
      case "id":
      case "label":
      case "message":
      case "messages":
      case "meta":
      case "note":
      case "only":
      case "options":
      case "prefs":
      case "preferences":
      case "presence":
      case "raw":
      case "rule":
      case "shared":
      case "strict":
      case "strip":
      case "tag":
      case "tailor":
      case "unit":
      //case "validate":
      case "falsy":
      case "sensitive":
      case "truthy":
      case "greater":
      case "less":
      case "multiple":
      case "precision":
      case "sign":
      case "unsafe":
      case "case":
      case "trim":
      case "truncate":
      case "append":
      case "keys":
      case "unknown":
      case "has":
      case "single":
      case "sparse":
      case "encoding":
      case "timetamp":
      case "match":
      case "min":
      case "max":
      case "length":
      case "map": {
        let arg = json[k];
        if (["default", "multiple", "less", "max", "min", "greater", "length"].includes(k)) {
          if (isObject(arg) && !("$ref" in arg)) {
            if ("limit" in arg)
              arg.limit = jsonToRef(arg.limit);
            else if ("base" in arg)
              arg.base = jsonToRef(arg.base);
          }
          else
            arg = jsonToRef(arg);
        }
        validation = validation[k](arg);
      }
        break;

      case "error":
        validation = validation.error(new Error(json[k]));
        break;

      // with options
      case "example":
      case "external":
      case "fork": {
        let arg1, arg2, key = OptionKey[k] || k;
        if (isObject(json[k]) && key in (json[k] as any)) {
          arg1 = json[k][key];
          delete json[k][key];
          arg2 = json[k][key];
        }
        else
          arg1 = json[k];

        if (k === "external")
          arg1 = eval(arg1);

        // @ts-ignore
        validation = arg2 !== undefined ? validation[k](arg1, arg2) : validation[k](arg1);
        break;
      }

      // spread
      case "allow":
      case "disallow":
      case "not":
      case "valid":
      case "invalid":
      case "try":
        validation = validation[k](...(Array.isArray(json[k]) ? json[k] : [json[k]]).map((v: any) => jsonToRef(v)));
        break;

      case "items":
      case "ordered":
        validation = validation[k](...(Array.isArray(json[k]) ? json[k] : [json[k]]).map((j: Schema) => fromJson(j)));
        break;

      // peers
      case "and":
      case "nand":
      case "or":
      case "oxor":
      case "xor":
        let args;
        if (isObject(json[k])) {
          if ("options" in json[k])
            args = [...json[k].peers, json[k].options];
          else
            args = json[k].peers;
        }
        else
          args = json[k];

        validation = validation[k](...args);
        break;

      // with options property
      case "pattern":
      case "regex": {

        if (json[k].type === "object")
          validation = (validation as Joi.ObjectSchema).regex();
        else {
          let arg1, arg2, arg3, key = OptionKey[k] || k;
          if (isObject(json[k]) && key in json[k]) {
            arg1 = json[k][key];
            arg2 = json[k].options;
            // object pattern
            arg3 = json[k].schema;
          }
          else
            arg1 = json[k];

          arg1 = jsonToRegex(arg1);

          validation = arg3 !== undefined ? validation[k](arg1, arg3, arg2) : (arg2 !== undefined ? validation[k](arg1, arg2) : validation[k](arg1));
        }

        break;
      }

      case "unique":
        if (json[k] === true)
          validation = validation[k]();

        else {
          let comparator: any, options = {};
          if (isObject(json[k])) {
            if ("comparator" in json[k])
              comparator = json[k].comparator;
            if ("options" in json[k])
              options = json[k].options;
          }
          else
            comparator = json[k];

          if (isStringFunction(comparator))
            comparator = eval(comparator);

          validation = validation[k](comparator, options);
        }

        break;

      case "rename":
        const from: string = json[k].from;
        const to: string = json[k].to;
        delete json[k].from;
        delete json[k].to;
        validation = validation[k](from, to, json[k]);
        break;

      case "replace":
        (Array.isArray(json[k]) ? json[k] : [json[k]]).forEach((r: TypeReplace) => {
          validation = validation[k](jsonToRegex(r.find), r.replace);
        });
        break;

      case "assert":
        let reference, schema, message;
        if (isObject(json[k])) {
          reference = json[k].reference;
          schema = json[k].schema;
          message = json[k].message;
        }
        else if (Array.isArray(json[k]))
          [reference, schema, message] = json[k];

        reference = jsonToRef(reference);

        validation = message !== undefined ? validation[k](reference, schema, message) : validation[k](reference, schema);

        break;

      case "with":
      case "without": {
        let key, peers, options;
        if (isObject(json[k])) {
          key = json[k].key;
          peers = json[k].peers;
          options = json[k].options;
        }
        else if (Array.isArray(json[k]))
          [key, peers, options] = json[k];

        validation = message !== undefined ? validation[k](key, peers, options) : validation[k](key, peers);

      }
        break;

      case "when":
      case "conditional":
        (Array.isArray(json[k]) ? json[k] : [json[k]]).forEach((when: any) => {
          validation = translateWhen(when, validation);
        });
        break;
      default:
        throw new Error(`Validation "${k}" not found!`);
    }
  }
  return validation;
}

export function toJson(joi: any): Schema {
  if (!isObject(joi)) {
    return joi;
  }
  const json: any = {
    type: joi.type as Schema["type"]
  };
  Object.keys(joi).forEach((key: string) => {
    const value = joi[key];
    switch (key) {
      case "_valids":
      case "_invalids":
        let schemaKey = null;
        switch (key) {
          case "_valids":
            schemaKey = joi._flags.only === true ? "valid" : "allow";
            break;
          case "_invalids":
            schemaKey = "invalid";
            break;
        }
        if (value) {
          json[schemaKey] = [];
          if (value._values)
            json[schemaKey] = [...json[schemaKey], ...Array.from(value._values)];
          if (value._refs)
            json[schemaKey] = [...json[schemaKey], ...Array.from(value._refs)];
        }
        break;
      case "_flags":
        if (joi[key]) {
          ["default", "single", "sparse"].forEach((_fk: string) => {
            if (_fk in joi[key])
              json[_fk] = joi[key][_fk];
          });
          if ("presence" in joi[key])
            json[joi[key].presence] = true;
        }

        break;
      case "_singleRules":
      case "_rules":
        joi[key].forEach((rule: any) => {
          if (rule.method === "items")
            return;
          let method: string = rule.method;
          const optionsOnly: Array<string> = ["guid", "uuid", "email", "hex", "hostname", "ip", "base64", "dataUri", "domain"];
          let value = cloneDeep(optionsOnly.includes(method)
            ? ((!!Object.keys(rule.args?.options || {}).length) ? rule.args.options : true)
            : (!!Object.keys(rule.args || {}).length) ? rule.args : true);

          if (["length", "compare"].includes(method))
            switch (rule.operator) {
              case ">=":
                method = "min";
                break;
              case "<=":
                method = "max";
                break;
              case "<":
                method = "less";
                break;
              case ">":
                method = "greater";
                break;
            }

          if (method === "sign") {
            switch (value.sign) {
              case "positive":
                method = "positive";
                value = true;
                break;
              case "negative":
                method = "negative";
                value = true;
                break;
            }
          }


          if (value?.limit)
            value.limit = extractRef(value?.limit);

          if (isObject(value)) {
            if (isObject(value) && "limit" in value && Object.keys(value).length === 1)
              value = value.limit;
            if (isObject(value) && "base" in value && Object.keys(value).length === 1)
              value = value.base;
            if (isObject(value) && "regex" in value)
              value.regex = regexToString(value.regex);
          }

          json[method] = value;

        });
        break;
      case "$_terms":
        if (Array.isArray(joi[key]?.items) && joi[key].items.length) {
          (json as ArraySchema).items = joi[key].items.map((it: Joi.Schema) => toJson(it));
          if (json.items.length === 1)
            json.items = json.items[0];
        }
        if (Array.isArray(joi[key]?.ordered) && joi[key].ordered.length) {
          (json as ArraySchema).ordered = joi[key].ordered.map((it: Joi.Schema) => toJson(it));
        }
        if (Array.isArray(joi[key]?.replacements)) {
          // @ts-ignore
          (json as StringSchema).replace = joi[key].replacements.map(r => {
            return {
              find: (r.pattern instanceof RegExp) ? regexToString(r.pattern) : r.pattern,
              replace: r.replacement
            };
          });
        }
        if (Array.isArray(joi[key]?.whens) && !!joi[key].whens.length) {

          json.when = joi[key].whens.map((when: any) => {
            let op: TypeWhen = {} as TypeWhen;
            if (when.ref) {
              op.reference = extractRef(when.ref);
              if ("is" in when)  {
                op.is = toJson(when.is);
              }
            }
            else {
              if ("schema" in when)
                op.schema = toJson(when.schema);
            }


            if ("then" in when)
              op.then = toJson(when.then);
            if ("otherwise" in when)
              op.otherwise = toJson(when.otherwise);
            if ("break" in when && typeof when.break === "boolean")
              op.break = when.break;
            if ("switch" in when)
              op.switch = when.switch.map((sw: any) => {
                let op: TypeWhen = {} as TypeWhen;
                op.reference = extractRef(sw.ref);
                if ("is" in sw)
                  op.is = toJson(sw.is);
                if ("then" in sw)
                  op.then = toJson(sw.then);
                if ("otherwise" in sw)
                  op.otherwise = toJson(sw.otherwise);
              });
            return op;
          })
        }
        break;
      case "_ids":
        if (value._byKey && json.type === "object") {
          (json as ObjectSchema).properties = {};
          value._byKey.forEach((k: any) => {
            (json as ObjectSchema).properties[k.id] = toJson(k.schema);
          })
        }
    }
  });

  return json;
}

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
  SymbolSchema
};
export default Joi;