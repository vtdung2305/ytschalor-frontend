import { getActivePinia } from 'pinia'
import { ExtendedPinia } from '@/interfaces/pinia'

export function useResetStore() {
  const pinia = getActivePinia() as ExtendedPinia

  if (!pinia) {
    throw new Error('There is no active Pinia instance')
  }

  const resetStore: Record<string, () => void> = {}

  pinia._s.forEach((store, name) => {
    resetStore[name] = () => store.$reset()
  })

  resetStore.all = () => pinia._s.forEach((store) => store.$reset())

  return resetStore
}
