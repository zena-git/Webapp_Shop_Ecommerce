import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type init = {
    value: {
        sidebar: boolean
    }
}

export const sidebar = createSlice({
    name: 'sidebar',
    initialState: {
        value: {
            sidebar: true
        }
    } as init,
    reducers: {
        set: (state, action: PayloadAction<init>) => {
            return {
                value: {
                    sidebar: action.payload.value.sidebar
                }
            }

        },
        close: () => {
            return {
                value: {
                    sidebar: false
                }
            }
        },
        open: () => {
            return {
                value: {
                    sidebar: true
                }

            };
        },
        reverse: (state) => {
            return {
                value: {
                    sidebar: !state.value.sidebar
                }

            }
        }
    },

}
)

export default sidebar.reducer
export const { set, close, open, reverse } = sidebar.actions