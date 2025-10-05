import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface Product {
  _id: string
  title: string
  slug: string
  description: string
  brand: string
  country: string
  price: number
  images: string[]
  inventory: number
  rating: number
  reviewCount: number
  featured: boolean
  createdAt: string
}

interface ProductsState {
  products: Product[]
  featuredProducts: Product[]
  currentProduct: Product | null
  loading: boolean
  filters: {
    brand: string[]
    country: string[]
    priceRange: [number, number]
    rating: number
  }
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

const initialState: ProductsState = {
  products: [],
  featuredProducts: [],
  currentProduct: null,
  loading: false,
  filters: {
    brand: [],
    country: [],
    priceRange: [0, 10000],
    rating: 0,
  },
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  },
}

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload
      state.loading = false
    },

    setFeaturedProducts: (state, action: PayloadAction<Product[]>) => {
      state.featuredProducts = action.payload
    },

    setCurrentProduct: (state, action: PayloadAction<Product | null>) => {
      state.currentProduct = action.payload
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },

    updateFilters: (state, action: PayloadAction<Partial<ProductsState["filters"]>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },

    setPagination: (state, action: PayloadAction<Partial<ProductsState["pagination"]>>) => {
      state.pagination = { ...state.pagination, ...action.payload }
    },

    resetFilters: (state) => {
      state.filters = initialState.filters
      state.pagination.page = 1
    },
  },
})

export const {
  setProducts,
  setFeaturedProducts,
  setCurrentProduct,
  setLoading,
  updateFilters,
  setPagination,
  resetFilters,
} = productsSlice.actions

export default productsSlice.reducer
