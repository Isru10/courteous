import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface OrderItem {
  productId: string
  title: string
  price: number
  quantity: number
  image: string
}

export interface TrackingEvent {
  status: string
  timestamp: string
  note?: string
}

export interface Order {
  _id: string
  userId: string
  items: OrderItem[]
  subtotal: number
  total: number
  status: "pending" | "paid" | "on_route" | "delivered" | "cancelled"
  stripeSessionId?: string
  trackingEvents: TrackingEvent[]
  createdAt: string
  updatedAt: string
}

interface OrdersState {
  orders: Order[]
  currentOrder: Order | null
  loading: boolean
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

const initialState: OrdersState = {
  orders: [],
  currentOrder: null,
  loading: false,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
}

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload
      state.loading = false
    },

    setCurrentOrder: (state, action: PayloadAction<Order | null>) => {
      state.currentOrder = action.payload
    },

    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.unshift(action.payload)
    },

    updateOrder: (state, action: PayloadAction<Order>) => {
      const index = state.orders.findIndex((order) => order._id === action.payload._id)
      if (index !== -1) {
        state.orders[index] = action.payload
      }
      if (state.currentOrder?._id === action.payload._id) {
        state.currentOrder = action.payload
      }
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },

    setPagination: (state, action: PayloadAction<Partial<OrdersState["pagination"]>>) => {
      state.pagination = { ...state.pagination, ...action.payload }
    },
  },
})

export const { setOrders, setCurrentOrder, addOrder, updateOrder, setLoading, setPagination } = ordersSlice.actions

export default ordersSlice.reducer
