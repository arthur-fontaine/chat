// https://github.com/vitest-dev/vitest/blob/6d1b145118d42b14bc0739820c4ce9e17fbd45dd/packages/vitest/src/typecheck/assertType.ts#L3

function noop() { }

export interface AssertType {
  <T>(value: T): void
}

export const assertType: AssertType = noop
