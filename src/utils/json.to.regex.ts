import { isObject } from './is.object';

export function jsonToRegex(regex: any) {
  if (regex.regex)
    regex = regex.regex;

  if (isObject(regex) && '$regex' in regex) {
    if ('flags' in regex)
      return new RegExp(regex['$regex'], regex.flags);

    return new RegExp(regex['$regex']);
  }

  return new RegExp(regex);
}
