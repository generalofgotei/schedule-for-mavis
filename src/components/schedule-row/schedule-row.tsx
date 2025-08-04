import React from 'react';
import { EmployeeRow, Shift } from '../../types';
import { ShiftBar } from '../shift-bar/shift-bar';
import { useAppDispatch } from '../../store/hooks';
import { setTooltip } from '../../store/slices/scheduleSlice';
import { 
  formatTime, 
  getShiftStatus, 
  calculateDuration, 
  formatDuration,
  findMatchingFactShift,
  isDateInPastOrToday
} from '../../utils/scheduleUtils';

interface ScheduleRowProps {
  data: EmployeeRow;
  currentDate: string;
}

export const ScheduleRow: React.FC<ScheduleRowProps> = ({ data, currentDate }) => {
  const dispatch = useAppDispatch();
  const { planShifts, factShifts } = data;
  const { employee, store, role } = planShifts[0]
  console.log(planShifts)
  const handleShiftClick = (shift: Shift, type: 'plan' | 'fact', event: React.MouseEvent) => {
    const startTime = formatTime(shift.startTime);
    const endTime = formatTime(shift.endTime);
    const duration = calculateDuration(shift.startTime, shift.endTime);
    const formattedDuration = formatDuration(duration);
    
    const tooltipText = `${employee} - ${store} - ${role}\n${type === 'plan' ? 'План' : 'Факт'}: ${startTime} - ${endTime} (${formattedDuration})`;
    
    dispatch(setTooltip({
      x: event.clientX,
      y: event.clientY,
      text: tooltipText
    }));
  };

  // Фильтруем смены для текущей даты
  const currentDatePlanShifts = planShifts.filter(shift => {
    const shiftDate = shift.startTime.split('T')[0];
    return shiftDate === currentDate;
  });

  const currentDateFactShifts = factShifts.filter(shift => {
    const shiftDate = shift.startTime.split('T')[0];
    return shiftDate === currentDate;
  });

  return (
    <div className="schedule-row__shifts">
      {currentDatePlanShifts.map((planShift, index) => {
        const factShift = findMatchingFactShift(planShift, currentDateFactShifts);
        const status = getShiftStatus(planShift, factShift);
        const isDatePastOrToday = isDateInPastOrToday(currentDate);
        
        return (
          <React.Fragment key={`${planShift.startTime}-${index}`}>
            <ShiftBar 
              shift={planShift}
              type="plan"
              onClick={(e) => handleShiftClick(planShift, 'plan', e)}
            />
            {factShift ? (
              <ShiftBar 
                shift={factShift}
                type="fact"
                status={status}
                onClick={(e) => handleShiftClick(factShift, 'fact', e)}
              />
            ) : (
              isDatePastOrToday && (
                <ShiftBar 
                  shift={planShift}
                  type="fact"
                  status="absent"
                  onClick={(e) => handleShiftClick(planShift, 'plan', e)}
                />
              )
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};