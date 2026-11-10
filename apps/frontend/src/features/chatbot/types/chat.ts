export type MessageSender = 'user' | 'bot' | 'system'

export interface QuickReplyOption {
  label: string
  query: string
  actionUrl?: string
}

export interface ChatActionLink {
  label: string
  url: string
  isExternal?: boolean
}

export interface ChatMessage {
  id: string
  sender: MessageSender
  text: string
  timestamp: number
  quickReplies?: QuickReplyOption[]
  actionLink?: ChatActionLink
  isTyping?: boolean
}

export interface ChatbotPreferences {
  soundEnabled: boolean
  autoGreeted: boolean
  hasUnread: boolean
}
