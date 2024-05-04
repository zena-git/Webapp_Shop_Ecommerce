import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// @ts-ignore
import dayjs, { Dayjs } from 'dayjs';

type Init = {
    value: {
        date: {
            startDate: string,
            endDate: string
        }
    };
};

export const selectedData = createSlice({
    name: 'tt',
    initialState: {
        value: {
            date: {
                startDate: new Date().toISOString(),
                endDate: new Date().toISOString()
            }
        },
    },
    reducers: {
        setDateRange: (state, action: PayloadAction<Init>) => {
            state.value.date = action.payload.value.date;
        },
    },
});

export default selectedData.reducer;
export const { setDateRange } = selectedData.actions;
