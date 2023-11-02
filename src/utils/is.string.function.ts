export function isStringFunction(str: string): boolean {
  if (typeof str === 'string')
    return str.startsWith('(') || str.startsWith('function');

  return false;
}
