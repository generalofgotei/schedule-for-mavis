import React from 'react';
import { DateFilter } from '../date-filter/date-filter';
import { Schedule } from '../schedule/schedule';
import { useAppDispatch } from '../../store/hooks';
import { loadScheduleData } from '../../store/slices/scheduleSlice';

export const App: React.FC = () => {
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    dispatch(loadScheduleData());
  }, [dispatch]);

  return (
    <div className="app">
      <header className="schedule-header">
        <h1 className="schedule-header__title">Расписание сотрудников</h1>
        <DateFilter />
      </header>
      <Schedule />
    </div>
  );
};