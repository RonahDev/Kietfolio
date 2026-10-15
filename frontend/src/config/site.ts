/**
 * Centralized Site Configuration & Application Constants
 * Prevents hardcoding of keys, endpoints, and environment variables.
 */

export const SITE_CONFIG = {
  name: 'Mai Anh Kiệt',
  title: 'Kietfolio — Software Engineering & Systems Architecture',
  version: '2.5.0',
  apiBaseUrl: import.meta.env.VITE_API_URL || '', // Point to backend when deployed
  author: {
    name: 'Mai Anh Kiệt',
    email: 'kietteve22102005@gmail.com',
    github: 'https://github.com/RonahDev',
    linkedin: 'https://linkedin.com/in/maianhkiet',
  },
  storageKeys: {
    session: 'kietfolio_auth_active_session',
    usersDb: 'kietfolio_registered_users_db',
    guestbook: 'kietfolio_guestbook_entries',
    inbox: 'kietfolio_inbox_messages',
    language: 'kietfolio_preferred_language',
    theme: 'kietfolio_theme',
    introSeen: 'kietfolio_intro_seen',
  },
  timeouts: {
    apiDefaultMs: 8000,
    toastDismissMs: 3000,
    clipboardFeedbackMs: 2500,
  },
} as const

