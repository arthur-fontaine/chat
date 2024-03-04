export interface Conversation {
  participants: {
    avatar: string
    color: string
    colorGradient: [string, string]
    id: string
    isMe: boolean
    name: string
  }[]
}
