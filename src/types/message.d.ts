export interface Message {
  date: Date
  fromId: string
  id: string
  state: 'received' | 'seen' | 'sending'
  text: string
}
