import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    admin: {}
}

export const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        saveAdmin: (state, action) => {
            state.admin = action.payload
        },
        removeAdmin: (state) => {
            state.admin = {}
        },
    },
})

export const { saveAdmin, removeAdmin } = adminSlice.actions

export default adminSlice.reducer 