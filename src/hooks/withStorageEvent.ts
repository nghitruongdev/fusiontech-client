import { Mutate, StoreApi } from 'zustand'

type StoreWithPersist = Mutate<
  StoreApi<unknown>,
  [['zustand/persist', unknown]]
>

export const withStorageDOMEvents = (store: StoreWithPersist) => {
  const storageEventCallback = (e: StorageEvent) => {
    if (e.key === store.persist.getOptions().name && e.newValue) {
      store.persist.rehydrate()
      console.debug('e.key', e.key)
      console.debug('e.oldValue', e.oldValue)
      console.debug('e.newValue', e.newValue)
    }
  }

  window.addEventListener('storage', storageEventCallback)

  return () => {
    window.removeEventListener('storage', storageEventCallback)
  }
}
