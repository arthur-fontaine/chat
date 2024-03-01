import { useCallback, useEffect, useState } from 'react'
import * as SplashScreen from 'expo-splash-screen'
import { InteractionManager } from 'react-native'

export function useSplashScreen() {
  const [promises, setPromises] = useState<(Promise<boolean>)[]>([])
  const [interactionsComplete, setInteractionsComplete] = useState(false)

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setInteractionsComplete(true)
    })
  }, [])

  useEffect(() => {
    if (!interactionsComplete) {
      return
    }

    Promise.all(promises).then((results) => {
      if (results.every(Boolean)) {
        SplashScreen.hideAsync()
      }
    })
  }, [promises, interactionsComplete])

  const hideSplashScreenUntil = useCallback(
    (promise: Promise<boolean>) => {
      setPromises(prev => [...prev, promise])
    },
    [setPromises],
  )

  return {
    hideSplashScreenUntil,
  }
}
