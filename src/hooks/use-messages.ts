import { useRef } from 'react'
import type { Message } from '~/types/message'

export function useMessages(): { messages: Message[] } {
  return useRef({
    messages: mockMessages,
  }).current
}

const mockMessages: Message[] = Array(1000).fill(null).flatMap((_, index) => {
  const date = new Date()
  date.setDate(date.getDate() + index)

  return [
    {
      date: (() => {
        const d = new Date(date)
        d.setHours(21, 5, 0, 0)
        return d
      })(),
      fromId: '1',
      id: `1${index}`,
      state: 'seen',
      text: `A French 20-year-old autodidact full-stack developer currently living in Paris. I am currently studying data and AI at HETIC.
  
Passionate about new technologies and dreaming up all kinds of ideas since I was young, my first computer and my first programming experience at the age of 12 changed a lot in my life. My creative mind was able to channel itself into bringing some of my projects to reality.`,
    },
    {
      date: (() => {
        const d = new Date(date)
        d.setHours(21, 15, 0, 0)
        return d
      })(),
      fromId: '2',
      id: `2${index}`,
      state: 'seen',
      text: 'ok.',
    },
    {
      date: (() => {
        const d = new Date(date)
        d.setHours(21, 25, 0, 0)
        return d
      })(),
      fromId: '2',
      id: `3${index}`,
      state: 'seen',
      text: 'Ça va ?',
    },
    {
      date: (() => {
        const d = new Date(date)
        d.setHours(21, 35, 0, 0)
        return d
      })(),
      fromId: '1',
      id: `4${index}`,
      state: 'seen',
      text: 'Nan',
    },
    {
      date: (() => {
        const d = new Date(date)
        d.setHours(21, 45, 0, 0)
        return d
      })(),
      fromId: '2',
      id: `5${index}`,
      state: 'seen',
      text: 'Pourquoi ?',
    },
    {
      date: (() => {
        const d = new Date(date)
        d.setHours(22, 5, 0, 0)
        return d
      })(),
      fromId: '1',
      id: `6${index}`,
      state: 'seen',
      text: 'Parce que tu veux pas faire d’escape game',
    },
    {
      date: (() => {
        const d = new Date(date)
        d.setHours(22, 25, 0, 0)
        return d
      })(),
      fromId: '2',
      id: `7${index}`,
      state: 'seen',
      text: 'Je mange mon couscous au berkoukes déso',
    },
    {
      date: (() => {
        const d = new Date(date)
        d.setHours(22, 55, 0, 0)
        return d
      })(),
      fromId: '1',
      id: `8${index}`,
      state: 'received',
      text: 'C’est ce que tu dis tout le temps............',
    },
  ]
})
