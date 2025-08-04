import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './index';
import { EmployeeRow } from '../types';
import { isShiftInDateRange } from '../utils/scheduleUtils';

export const selectScheduleState = (state: RootState) => state.schedule;

export const selectDateRange = createSelector(
  [selectScheduleState],
  (schedule) => {
    const { startDate, endDate } = schedule;
    const dates: string[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const current = new Date(start);
    while (current <= end) {
      dates.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }
    
    return { startDate, endDate, dates };
  }
);

export const selectTooltip = createSelector(
  [selectScheduleState],
  (schedule) => schedule.tooltip
);

export const selectFilteredData = createSelector(
  [selectScheduleState],
  (schedule): EmployeeRow[] => {
    const { planData, factData, startDate, endDate } = schedule;
    
    // Фильтруем данные по диапазону дат
    const filteredPlan = planData.filter(shift => 
      isShiftInDateRange(shift, startDate, endDate)
    );
    
    const filteredFact = factData.filter(shift => 
      isShiftInDateRange(shift, startDate, endDate)
    );
    
    // Группируем по сотруднику и магазину
    const grouped: Record<string, EmployeeRow> = {};
    
    filteredPlan.forEach(shift => {
      const key = `${shift.employee}-${shift.store}`;
      if (!grouped[key]) {
        grouped[key] = {
          employee: shift.employee,
          store: shift.store,
          planShifts: [],
          factShifts: []
        };
      }
      grouped[key].planShifts.push(shift);
    });
    
    filteredFact.forEach(shift => {
      const key = `${shift.employee}-${shift.store}`;
      if (grouped[key]) {
        grouped[key].factShifts.push(shift);
      }
    });
    
    return Object.values(grouped).sort((a, b) => 
      a.employee.localeCompare(b.employee, 'ru')
    );
  }
);