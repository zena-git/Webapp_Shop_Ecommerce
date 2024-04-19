import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { SelectedCustomer } from '../../lib/type';

type Init = {
    value: {
        selected: SelectedCustomer[];
    };
};

export const selectedData = createSlice({
    name: 'selectedCustomer',
    initialState: {
        value: {
            selected: [],
        },
    } as Init,
    reducers: {
        set: (state, action: PayloadAction<Init>) => {
            state.value.selected = action.payload.value.selected;
        },
        updateSelected: (state, action: PayloadAction<{ id: number; selected: boolean }>) => {
            const { id, selected } = action.payload;
            const selectedItem = state.value.selected.find(item => item.id === id);
            if (selectedItem) {
                if (selectedItem.disable) {

                } else {
                    selectedItem.selected = selected;
                }
            } else {
                state.value.selected.push({ id: id, selected: true });
            }
        },
    },
});

export default selectedData.reducer;
export const { set, updateSelected } = selectedData.actions;
