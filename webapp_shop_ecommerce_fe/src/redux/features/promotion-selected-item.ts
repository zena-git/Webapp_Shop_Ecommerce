import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Selected } from '../../lib/type';

type Init = {
    value: {
        selected: Selected[];
    };
};

export const selectedData = createSlice({
    name: 'selectedProduct',
    initialState: {
        value: {
            selected: [],
        },
    } as Init,
    reducers: {
        set: (state, action: PayloadAction<Init>) => {
            state.value.selected = action.payload.value.selected;
        },
        toggleChildren: (state, action: PayloadAction<{ parentId: number; id: number; value: boolean }>) => {
            const { parentId, id, value } = action.payload;
            const parentItem = state.value.selected.find(item => item.id == parentId);
            if (parentItem) {
                const childItem = parentItem.children.find(child => child.id == id);
                if (childItem) {
                    childItem.selected = value;
                } else {
                    parentItem.children.push({ id: id, selected: value })
                }
            }
            state.value.selected.forEach(item => {
                if (item.children.some(child => !child.selected)) {
                    item.selected = false;
                } else {
                    item.selected = true;
                }
            });
        },
        updateSelected: (state, action: PayloadAction<{ id: number; selected: boolean }>) => {
            const { id, selected } = action.payload;
            const selectedItem = state.value.selected.find(item => item.id === id);
            if (selectedItem) {
                selectedItem.selected = selected;
                // If the parent is selected, select all children
                if (selected) {
                    selectedItem.children.forEach(child => (child.selected = true));
                } else {
                    // If the parent is not selected, deselect all children
                    selectedItem.children.forEach(child => (child.selected = false));
                }
            } else {
                state.value.selected.push({ id: id, children: [], selected: true });
            }
            // Check if all children are selected, if not, deselect the parent
            state.value.selected.forEach(item => {
                if (item.children.some(child => !child.selected)) {
                    item.selected = false;
                }
            });
        },
    },
});

export default selectedData.reducer;
export const { set, updateSelected, toggleChildren } = selectedData.actions;
