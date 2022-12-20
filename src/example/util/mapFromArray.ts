export function deriveMapFromArray<T>(array: T[], mapFn: (item: T) => any) {
  const map = new Map<any, any>();
  array.forEach(item => {
    map.set(mapFn(item), item);
  });
  return map;
}
