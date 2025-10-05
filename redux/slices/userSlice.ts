import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface User {
  id: string
  email: string
  name: string
  avatarUrl?: string
  role: "customer" | "admin"
}

interface UserState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  loading: false,
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
      state.loading = false
    },

    clearUser: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.loading = false
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },

    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    },
  },
})

export const { setUser, clearUser, setLoading, updateUser } = userSlice.actions
export default userSlice.reducer
