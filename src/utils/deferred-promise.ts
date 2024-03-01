export function createDeferredPromise<T>() {
  let resolve: (value: T) => void
  let reject: (reason: unknown) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  }) as Promise<T> & {
    reject: typeof reject
    resolve: typeof resolve
  }
  promise.resolve = (value: T) => resolve(value)
  promise.reject = (reason: unknown) => reject(reason)
  return promise
}
