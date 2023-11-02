import { JsonRegex } from '../interfaces';

export function regexToString(regex: RegExp): JsonRegex {
  const str: string = regex.toString();
  const lastSlash: number = str.lastIndexOf('/');
  const output: JsonRegex = {
    $regex: str.substr(1, lastSlash - 1)
  };

  if (str.length > (lastSlash + 1))
    output.flags = str.substr(lastSlash + 1, 10);

  return output;
}
