export function cloneDeep(json: object) {
  return JSON.parse(JSON.stringify(json));
}
