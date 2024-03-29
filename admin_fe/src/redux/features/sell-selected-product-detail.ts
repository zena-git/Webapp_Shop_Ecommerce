import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { SelectedProductDetail } from '../../lib/type';

type Init = {
    value: {
        selected: SelectedProductDetail[];
    };
};

export const selectedData = createSlice({
    name: 'selectedDetailProduct',
    initialState: {
        value: {
            selected: [],
        },
    } as Init,
    reducers: {
        set: (state, action: PayloadAction<{ selected: SelectedProductDetail[] }>) => {
            state.value.selected = action.payload.selected;
        },
        removeSelected: (state, action: PayloadAction<{ id: number }>) => {
            state.value.selected = state.value.selected.filter(val => val.detail_id != action.payload.id)
        },
        updateSelected: (state, action: PayloadAction<{ id: number; buy_quantity: number, image: string, name: string, price: number, type: string, quantity: number }>) => {
            const { id, quantity, image, name, type, price, buy_quantity } = action.payload;
            state.value.selected.push({ buy_quantity: buy_quantity, detail_id: id, image, name, type, price, quantity })

        },
        updateQuantity: (state, action: PayloadAction<{ id: number, quantity: number }>) => {
            const { id, quantity } = action.payload;
            console.log(id);
            state.value.selected = state.value.selected.map(current => {
                if (current.detail_id == id) {
                    console.log(current)
                    return { ...current, buy_quantity: quantity }
                } else {
                    return current
                }
            })
        }
    },
});

export default selectedData.reducer;
export const { set, updateSelected, updateQuantity, removeSelected } = selectedData.actions;
