import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import type { Profile } from '~/types/profile'
import { assertType } from '~/types/utils/assert-type'

export const profiles = sqliteTable('profiles', {
  color: text('color').notNull(),
  displayName: text('displayName').notNull(),
  id: integer('id').primaryKey().notNull(),
  userId: text('userId').notNull(),
})

assertType<Profile>(profiles.$inferSelect)
assertType<typeof profiles['$inferSelect']>({} as Profile)
