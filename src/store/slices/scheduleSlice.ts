import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { ScheduleState, TooltipData, ScheduleData } from '../../types';

// Async thunk для загрузки данных расписания
export const loadScheduleData = createAsyncThunk(
  'schedule/loadScheduleData',
  async () => {
    const response = await fetch('./api/schedule-data.json');
    if (!response.ok) {
      throw new Error('Ошибка загрузки данных расписания');
    }
    return await response.json() as ScheduleData;
  }
);

const getCurrentDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

const getDatePlusDays = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

const initialState: ScheduleState = {
  startDate: getCurrentDate(),
  endDate: getDatePlusDays(3),
  planData: [],
  factData: [],
  tooltip: null,
};

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    setDateRange: (state, action: PayloadAction<{ startDate: string; endDate: string }>) => {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
    },
    setStartDate: (state, action: PayloadAction<string>) => {
      state.startDate = action.payload;
    },
    setEndDate: (state, action: PayloadAction<string>) => {
      state.endDate = action.payload;
    },
    setTooltip: (state, action: PayloadAction<TooltipData | null>) => {
      state.tooltip = action.payload;
    },
    clearTooltip: (state) => {
      state.tooltip = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadScheduleData.fulfilled, (state, action) => {
        state.planData = action.payload.plan;
        state.factData = action.payload.fact;
      })
      .addCase(loadScheduleData.rejected, (state, action) => {
        console.error('Ошибка загрузки данных расписания:', action.error.message);
        state.planData = [];
        state.factData = [];
      });
  },
});

export const {
  setDateRange,
  setStartDate,
  setEndDate,
  setTooltip,
  clearTooltip,
} = scheduleSlice.actions;

export default scheduleSlice.reducer;