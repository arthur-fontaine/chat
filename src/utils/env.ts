import process from 'node:process'

export const supabaseUrl = getEnvVar('EXPO_PUBLIC_SUPABASE_URL')
export const supabaseAnonKey = getEnvVar('EXPO_PUBLIC_SUPABASE_ANON_KEY')

function getEnvVar(envVar: string): string {
  const value = process.env[envVar]
  if (!value) {
    // eslint-disable-next-line fp/no-throw
    throw new Error(`Environment variable ${envVar} is not set`)
  }
  return value
}
