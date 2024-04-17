'use client'
import { storage } from './storage'
import { Provider } from 'react-redux'

export default function ValProvider({ children }) {
    return (
        <Provider store={storage}>
            {children}
        </Provider>
    )
}