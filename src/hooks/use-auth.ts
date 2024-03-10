import { atom, task } from 'nanostores'
import { useMemo } from 'react'
import type { Session } from '@supabase/supabase-js'
import { useStore } from '@nanostores/react'
import { supabase } from '~/utils/supabase'

const sessionAtom = atom<Session | null | undefined>(undefined)

task(async () => {
  const session = await supabase.auth.getSession()
  sessionAtom.set(session.data.session)

  supabase.auth.onAuthStateChange((_, session) => {
    sessionAtom.set(session)
  })
})

export function useAuth() {
  const session = useStore(sessionAtom)

  const authenticated = useMemo(() => session !== null, [session])
  const isReady = useMemo(() => session !== undefined, [session])

  return {
    authenticated,
    isReady,
    userId: session?.user.id,
  }
}
