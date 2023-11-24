export function findDuplicateIndices<T, D>(items: T[], mapper: (item: T) => D) :number[][] {
  const itemMap = items.reduce((map, item, index) => {
    const keyValue = mapper(item);

    if (!keyValue) return map;
    const indices = map.get(keyValue) || [];

    indices.push(index);
    map.set(keyValue, indices);

    return map;
  }, new Map<D, number[]>());

  return Array.from(itemMap.values())
    .filter((indices: number[]) => indices.length > 1);
}
