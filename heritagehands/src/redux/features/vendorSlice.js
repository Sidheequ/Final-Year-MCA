import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    vendor: {}
}

export const vendorSlice = createSlice({
    name: 'vendor',
    initialState,
    reducers: {
        saveVendor: (state, action) => {
            state.vendor = action.payload
        },
        removeVendor: (state) => {
            state.vendor = {}
        },
    },
})

export const { saveVendor, removeVendor } = vendorSlice.actions

export default vendorSlice.reducer 