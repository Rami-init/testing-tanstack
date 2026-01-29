import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ProductWithRelations } from '@/db/schema'

interface WishlistState {
  items: Array<ProductWithRelations>
  toggleItem: (item: ProductWithRelations) => void
  removeItem: (id: number) => void
  isExisting: (id: number) => boolean
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggleItem: (item) => {
        const existingItem = get().items.find((i) => i.id === item.id)
        if (existingItem) {
          set({ items: get().items.filter((i) => i.id !== item.id) })
        } else {
          set({ items: [...get().items, item] })
        }
      },
      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) })
      },
      isExisting: (id) => {
        return get().items.some((i) => i.id === id)
      },
    }),
    {
      name: 'wishlist-storage',
    },
  ),
)
