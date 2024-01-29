import { ArraySchema, ObjectSchema, Schema, StringSchema, TypeWhen } from './interfaces';
import { cloneDeep, extractRef, isObject, regexToString } from './utils';
import * as Joi from 'joi';

export function toJson(joi: any): Schema {
  if (!isObject(joi)) {
    return joi;
  }

  const json: any = {
    type: joi.type as Schema['type']
  };

  Object.keys(joi).forEach((key: string) => {
    const value = joi[key];

    switch (key) {
    case '_preferences':
      if (joi._preferences?.convert === false)
        json.strict = true;

      break;
    case '_valids':
    case '_invalids':
      let schemaKey = null;

      switch (key) {
      case '_valids':
        schemaKey = joi._flags.only === true ? 'valid' : 'allow';
        break;
      case '_invalids':
        schemaKey = 'invalid';
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
    case '_flags':
      if (joi[key]) {
        ['default', 'single', 'sparse', 'label', 'match'].forEach((_fk: string) => {
          if (_fk in joi[key])
            json[_fk] = joi[key][_fk];
        });
        if ('presence' in joi[key])
          json[joi[key].presence] = true;
      }

      break;
    case '_singleRules':
    case '_rules':
      joi[key].forEach((rule: any) => {
        if (rule.method === 'items')
          return;

        let method: string = rule.method;
        const optionsOnly: Array<string> = ['guid', 'uuid', 'email', 'hex', 'hostname', 'ip', 'base64', 'dataUri', 'domain', 'uri'];
        let value = cloneDeep(optionsOnly.includes(method)
          ? ((Object.keys(rule.args?.options || {}).length) ? rule.args.options : true)
          : (Object.keys(rule.args || {}).length) ? rule.args : true);

        if (['length', 'compare'].includes(method))
          switch (rule.operator) {
          case '>=':
            method = 'min';
            break;
          case '<=':
            method = 'max';
            break;
          case '<':
            method = 'less';
            break;
          case '>':
            method = 'greater';
            break;
          }

        if (method === 'sign') {
          switch (value.sign) {
          case 'positive':
            method = 'positive';
            value = true;
            break;
          case 'negative':
            method = 'negative';
            value = true;
            break;
          }
        }

        if (method === 'trim')
          value = true;

        if (value?.limit)
          value.limit = extractRef(value?.limit);

        if (isObject(value)) {
          if (isObject(value) && 'limit' in value && Object.keys(value).length === 1)
            value = value.limit;

          if (isObject(value) && 'base' in value && Object.keys(value).length === 1)
            value = value.base;

          if (isObject(value) && 'regex' in value)
            value.regex = regexToString(rule.args.regex);
        }

        json[method] = value;

      });
      break;
    case '$_terms':
      if (Array.isArray(joi[key]?.items) && joi[key].items.length) {
        (json as ArraySchema).items = joi[key].items.map((it: Joi.Schema) => toJson(it));
        if (json.items.length === 1)
          json.items = json.items[0];
      }

      if (Array.isArray(joi[key]?.ordered) && joi[key].ordered.length) {
        (json as ArraySchema).ordered = joi[key].ordered.map((it: Joi.Schema) => toJson(it));
      }

      if (Array.isArray(joi[key]?.matches) && joi[key].matches.length) {
        (json as ArraySchema).try = joi[key].matches.map((it: { schema: Joi.Schema }) => toJson(it.schema));
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

      if (Array.isArray(joi[key]?.metas) && joi[key].metas.length) {
        json.meta = {};
        joi[key].metas.forEach((meta: Record<string, any>) => json.meta = { ...json.meta, ...meta });
      }

      if (Array.isArray(joi[key]?.whens) && !!joi[key].whens.length) {

        json.when = joi[key].whens.map((when: any) => {
          let op: TypeWhen = {} as TypeWhen;

          if (when.ref) {
            op.reference = extractRef(when.ref);
            if ('is' in when) {
              op.is = toJson(when.is);
            }
          }
          else {
            if ('schema' in when)
              op.schema = toJson(when.schema);
          }

          if ('then' in when)
            op.then = toJson(when.then);

          if ('otherwise' in when)
            op.otherwise = toJson(when.otherwise);

          if ('break' in when && typeof when.break === 'boolean')
            op.break = when.break;

          if ('switch' in when)
            op.switch = when.switch.map((sw: any) => {
              let op: TypeWhen = {} as TypeWhen;

              op.reference = extractRef(sw.ref);
              if ('is' in sw)
                op.is = toJson(sw.is);

              if ('then' in sw)
                op.then = toJson(sw.then);

              if ('otherwise' in sw)
                op.otherwise = toJson(sw.otherwise);
            });

          return op;
        });
      }

      break;
    case '_ids':
      if (value._byKey && json.type === 'object') {
        (json as ObjectSchema).properties = {};
        value._byKey.forEach((k: any) => {
          (json as ObjectSchema).properties[k.id] = toJson(k.schema);
        });
      }
    }
  });

  return json;
}
