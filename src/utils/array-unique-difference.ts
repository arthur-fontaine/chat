export function arrayUniqueDifference<T, V>(
  a: Readonly<T[]> | T[],
  b: Readonly<T[]> | T[],
  { getKey, isItemUpdated }: {
    getKey: (item: T) => V
    isItemUpdated: (a: T, b: T) => boolean
  },
): { added: T[], removed: T[], updated: T[] } {
  const keyToItemA = new Map<V, T>()
  const keyToItemB = new Map<V, T>()

  for (const item of a) {
    keyToItemA.set(getKey(item), item)
  }
  for (const item of b) {
    keyToItemB.set(getKey(item), item)
  }

  const added: T[] = []
  const removed: T[] = []
  const updated: T[] = []

  for (const [keyB, itemB] of keyToItemB) {
    const itemA = keyToItemA.get(keyB)
    if (itemA === undefined) {
      added.push(itemB)
    }
    else if (isItemUpdated(itemA, itemB)) {
      updated.push(itemB)
    }
  }

  for (const [keyA, itemA] of keyToItemA) {
    if (!keyToItemB.has(keyA)) {
      removed.push(itemA)
    }
  }

  return { added, removed, updated }
}
