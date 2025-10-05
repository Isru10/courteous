import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface KPIData {
  totalRevenue: number
  activeUsers: number
  totalOrders: number
  averageOrderValue: number
}

interface ChartData {
  date: string
  revenue: number
  orders: number
}

interface BrandSalesData {
  brand: string
  sales: number
  revenue: number
}

interface OrderStatusData {
  status: string
  count: number
  percentage: number
}

interface TopProduct {
  _id: string
  title: string
  brand: string
  totalSold: number
  revenue: number
}

interface AnalyticsState {
  kpis: KPIData
  revenueChart: ChartData[]
  brandSales: BrandSalesData[]
  orderStatus: OrderStatusData[]
  topProducts: TopProduct[]
  loading: boolean
  dateRange: {
    start: string
    end: string
  }
}

const initialState: AnalyticsState = {
  kpis: {
    totalRevenue: 0,
    activeUsers: 0,
    totalOrders: 0,
    averageOrderValue: 0,
  },
  revenueChart: [],
  brandSales: [],
  orderStatus: [],
  topProducts: [],
  loading: false,
  dateRange: {
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 30 days ago
    end: new Date().toISOString().split("T")[0], // today
  },
}

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    setKPIs: (state, action: PayloadAction<KPIData>) => {
      state.kpis = action.payload
    },

    setRevenueChart: (state, action: PayloadAction<ChartData[]>) => {
      state.revenueChart = action.payload
    },

    setBrandSales: (state, action: PayloadAction<BrandSalesData[]>) => {
      state.brandSales = action.payload
    },

    setOrderStatus: (state, action: PayloadAction<OrderStatusData[]>) => {
      state.orderStatus = action.payload
    },

    setTopProducts: (state, action: PayloadAction<TopProduct[]>) => {
      state.topProducts = action.payload
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },

    setDateRange: (state, action: PayloadAction<{ start: string; end: string }>) => {
      state.dateRange = action.payload
    },
  },
})

export const { setKPIs, setRevenueChart, setBrandSales, setOrderStatus, setTopProducts, setLoading, setDateRange } =
  analyticsSlice.actions

export default analyticsSlice.reducer
