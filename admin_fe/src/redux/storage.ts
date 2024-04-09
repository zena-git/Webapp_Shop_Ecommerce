import { configureStore } from '@reduxjs/toolkit'
import promotionReducer from './features/promotion-selected-item'
import sidebarReducer from './features/sidebar-slice'
import voucherReducer from './features/voucher-selected-item'
import voucherDeletedReducer from './features/voucher-deleted'
import userDeletedReducer from './features/voucher-deleted'
import SellReducer from './features/sell-selected-product-detail'
import promotionDateReducer from './features/promotion-date-selected'
import { TypedUseSelectorHook, useSelector } from 'react-redux'

export const storage = configureStore({
    reducer: {
        promotionReducer,
        voucherReducer,
        sidebarReducer,
        SellReducer,
        voucherDeletedReducer,
        userDeletedReducer,
        promotionDateReducer
    }
})

export type RootState = ReturnType<typeof storage.getState>
export type AppDispatch = typeof storage.dispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector