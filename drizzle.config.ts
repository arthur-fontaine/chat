import type { Config } from 'drizzle-kit'

export default {
  driver: 'expo',
  out: './src/database/drizzle',
  schema: './src/database/schema/schema.ts',
} satisfies Config
