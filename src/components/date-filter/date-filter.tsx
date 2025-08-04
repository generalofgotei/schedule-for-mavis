import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setStartDate, setEndDate } from '../../store/slices/scheduleSlice';
import { selectDateRange } from '../../store/selectors';

export const DateFilter: React.FC = () => {
  const dispatch = useAppDispatch();
  const { startDate, endDate } = useAppSelector(selectDateRange);

  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = event.target.value;
    dispatch(setStartDate(newStartDate));
    
    // Если начальная дата больше конечной, обновляем конечную
    if (newStartDate > endDate) {
      dispatch(setEndDate(newStartDate));
    }
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = event.target.value;
    dispatch(setEndDate(newEndDate));
    
    // Если конечная дата меньше начальной, обновляем начальную
    if (newEndDate < startDate) {
      dispatch(setStartDate(newEndDate));
    }
  };

  return (
    <div className="date-filter">
      <span className="date-filter__label">Временной период:</span>
      <div className='date-filter__input-container'>
        <input 
          type="date" 
          className="date-filter__input"
          value={startDate}
          onChange={handleStartDateChange}
          max={endDate}
        />
        <span>—</span>
        <input 
          type="date" 
          className="date-filter__input"
          value={endDate}
          onChange={handleEndDateChange}
          min={startDate}
        />
      </div>
    </div>
  );
};