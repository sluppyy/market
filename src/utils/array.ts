export function groupBy<T, Key>(arr: T[], key: (t: T) => Key): Map<Key, T> {
  const result = new Map()

  arr.forEach((t) => {
    result.set(key(t), t)
  })

  return result
}
