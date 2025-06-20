import { configureStore } from '@reduxjs/toolkit'
import userReducer from './features/userSlice'
import vendorReducer from './features/vendorSlice'
import adminReducer from './features/adminSlice'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import { combineReducers } from '@reduxjs/toolkit'

const rootReducer = combineReducers({
  user: userReducer,
  vendor: vendorReducer,
  admin: adminReducer,
})

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'vendor', 'admin'],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }),
})

export const persistor = persistStore(store)

