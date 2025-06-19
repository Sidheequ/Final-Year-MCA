import { createSlice } from '@reduxjs/toolkit'


const initialState= {
  user: {}
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
   saveUser: (state,action) => {
      state.user = action.payload
    },
    removeUser: (state) => {
      state.user = {}
    },
    logout: (state) => {
      state.user = {}
    }
  },
})


export const { saveUser, removeUser, logout } = userSlice.actions

export default userSlice.reducer