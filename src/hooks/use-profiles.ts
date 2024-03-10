import { useStore } from '@nanostores/react'
import { atom, task } from 'nanostores'
import { useEffect } from 'react'
import { useAuth } from './use-auth'
import { db } from '~/database/database'
import type { Profile } from '~/types/profile'
import { supabase } from '~/utils/supabase'

const profilesAtom = atom<Profile[]>([])

export function useProfiles() {
  const profiles = useStore(profilesAtom)

  // Initialize the profiles atom when the user is authenticated.
  const { authenticated } = useAuth()
  useEffect(() => {
    if (authenticated) {
      initializeProfiles()
    }
  }, [authenticated])

  return {
    profiles,
  }
}

function initializeProfiles() {
  task(async () => {
    await Promise.allSettled([
      // Initialize the profiles atom with the profiles from the remote database.
      supabase.from('profiles').select()
        .then(({ data }) => profilesAtom.set(
          data?.map(supabaseProfileToProfile) ?? [],
        )),

      // Initialize the profiles atom with the profiles from the local database.
      db.query.profiles.findMany().then(profilesAtom.set),
    ])
  })
}

type SupabaseProfile = supabase['tables']['profiles']['Row']

supabase.channel('profiles')
  // Listen to insert on the profiles table.
  .on<SupabaseProfile>(
  'postgres_changes',
  { event: 'INSERT', schema: 'public', table: 'profiles' },
  payload => profilesAtom.set([
    ...profilesAtom.get(),
    supabaseProfileToProfile(payload.new),
  ]),
)
  // Listen to delete on the profiles table.
  .on<SupabaseProfile>(
  'postgres_changes',
  { event: 'DELETE', schema: 'public', table: 'profiles' },
  payload => profilesAtom.set(
    profilesAtom.get().filter(profile => profile.id !== payload.old.id),
  ),
)
  // Listen to update on the profiles table.
  .on<SupabaseProfile>(
  'postgres_changes',
  { event: 'UPDATE', schema: 'public', table: 'profiles' },
  (payload) => {
    profilesAtom.set(
      profilesAtom.get().map(profile =>
        profile.id === payload.new.id
          ? supabaseProfileToProfile(payload.new)
          : profile,
      ),
    )
  },
)
  .subscribe()

function supabaseProfileToProfile(
  profile: supabase['tables']['profiles']['Row'],
): Profile {
  return {
    color: `#${profile.default_color.toString(16)}`,
    displayName: profile.display_name,
    id: profile.id,
    userId: profile.user,
  }
}
