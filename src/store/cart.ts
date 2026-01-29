import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '@/db/schema'

export type CartItem = Product & {
  quantity: number
}

interface CartState {
  items: Array<CartItem>
  addItem: (item: Product, quantity?: number) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  getTotalItemsCount: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item, quantity = 1) => {
        const existingItem = get().items.find((i) => i.id === item.id)
        if (existingItem) {
          set({
            items: get().items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i,
            ),
          })
        } else {
          set({ items: [...get().items, { ...item, quantity }] })
        }
      },
      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) })
      },
      updateQuantity: (id, quantity) => {
        set({
          items: get().items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        })
      },
      clearCart: () => {
        set({ items: [] })
      },
      getTotalItemsCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
    }),
    {
      name: 'cart-storage',
    },
  ),
)
