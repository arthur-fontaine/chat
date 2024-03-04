import { useRef } from 'react'
import type { Conversation } from '~/types/conversation'

export function useConversation(): { conversation: Conversation } {
  return useRef({
    conversation: {
      participants: [
        {
          avatar: 'https://randomuser.me/api/portraits',
          color: '#454ADE',
          colorGradient: ['#454ADE', '#4045DD'] as [string, string],
          id: '1',
          isMe: true,
          name: 'Arthur',
        },
        {
          avatar: 'https://randomuser.me/api/portraits',
          color: '#B14AED',
          colorGradient: ['#B14AED', '#AF45ED'] as [string, string],
          id: '2',
          isMe: false,
          name: 'Dounia',
        },
      ],
    },
  }).current
}
