import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import type { Message } from '~/types/message'
import { assertType } from '~/types/utils/assert-type'

export const messages = sqliteTable('messages', {
  color: text('color'),
  date: integer('date', { mode: 'timestamp' }).notNull(),
  fromId: text('fromId').notNull(),
  id: integer('id').primaryKey().notNull(),
  state: text('state', {
    enum: ['received', 'seen', 'sending', 'sent', 'failed'],
  }).notNull(),
  text: text('text'),
})

assertType<Message>(messages.$inferSelect)
// assertType<typeof messages['$inferSelect']>({} as Message)
