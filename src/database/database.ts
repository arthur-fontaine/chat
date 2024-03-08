import { drizzle } from 'drizzle-orm/expo-sqlite'
import { openDatabaseSync } from 'expo-sqlite/next'
import { task } from 'nanostores'
import { migrate } from 'drizzle-orm/expo-sqlite/migrator'
import * as schema from './schema/schema'
import migrations from './drizzle/migrations'

const dbFile = openDatabaseSync('db-01.db')
export const db = Object.assign(
  drizzle(dbFile, { schema }),
  {
    tables: schema,
  },
)

task(async () => {
  await migrate(db, migrations)
})
