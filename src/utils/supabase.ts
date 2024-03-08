import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import { supabaseAnonKey, supabaseUrl } from './env'
import type { Database } from '~/types/__generated__/supabase'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    detectSessionInUrl: false,
    persistSession: true,
    storage: AsyncStorage,
  },
})

// eslint-disable-next-line ts/no-redeclare
export type supabase = typeof supabase & {
  tables: Database['public']['Tables']
}
