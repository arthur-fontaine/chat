import { useCallback, useEffect, useState } from 'react'

const ERROR_STACK_TIMEOUT = 5_000

export function useError() {
  const [errorStack, setErrorStack] = useState<string[]>([])

  const throwError = useCallback((error: Error) => {
    setErrorStack(prev => [...prev, error.message])

    setTimeout(() => {
      setErrorStack(prev => prev.slice(1))
    }, ERROR_STACK_TIMEOUT)
  }, [])

  useEffect(() => {
    errorStack.forEach((error) => {
      console.error(error)
    })
  }, [errorStack])

  return {
    errorStack,
    throwError,
  }
}
