// Coffee++ client state (Zustand, persisted on the customer's device)
// - activeOrder: the order currently shown on the full-screen QR ticket
// - myOrders: the customer's saved orders, so they can re-open their QR
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Order } from "./types";

const MAX_SAVED_ORDERS = 20;

interface ClientState {
  activeOrder: Order | null;
  myOrders: Order[];
  setActiveOrder: (order: Order | null) => void;
  addOrder: (order: Order) => void;
  clearOrders: () => void;
}

export const useCoffeeStore = create<ClientState>()(
  persist(
    (set) => ({
      activeOrder: null,
      myOrders: [],
      setActiveOrder: (activeOrder) => set({ activeOrder }),
      addOrder: (order) =>
        set((s) => ({
          myOrders: [order, ...s.myOrders.filter((o) => o.orderId !== order.orderId)].slice(
            0,
            MAX_SAVED_ORDERS
          ),
        })),
      clearOrders: () => set({ myOrders: [], activeOrder: null }),
    }),
    {
      name: "coffeepp-orders",
      partialize: (state) => ({
        activeOrder: state.activeOrder,
        myOrders: state.myOrders,
      }),
    }
  )
);
