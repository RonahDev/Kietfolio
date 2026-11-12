import { seedCompleteDatabase } from './seedDatabase'

export async function seedUsersAndRoles(): Promise<void> {
  await seedCompleteDatabase()
}

// Allow direct CLI execution: tsx src/db/seedUsers.ts
if (require.main === module) {
  seedCompleteDatabase()
    .then(() => {
      // eslint-disable-next-line no-console
      console.log('✨ [Database Seed]: Finished cleanly.')
      process.exit(0)
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error('💥 [Database Seed Fatal]:', err)
      process.exit(1)
    })
}
