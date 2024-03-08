export interface Message {
  date: Date
  fromId: string
  id: number
  state: 'failed' | 'received' | 'seen' | 'sending' | 'sent'
  text: null | string
}
