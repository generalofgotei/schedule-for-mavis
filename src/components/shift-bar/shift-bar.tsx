import React from 'react';
import { Shift, ShiftType, ShiftStatus } from '../../types';
import { calculatePosition } from '../../utils/scheduleUtils';

interface ShiftBarProps {
  shift: Shift;
  type: ShiftType;
  status?: ShiftStatus;
  onClick: (event: React.MouseEvent) => void;
}

export const ShiftBar: React.FC<ShiftBarProps> = ({ shift, type, status, onClick }) => {
  const position = calculatePosition(shift.startTime, shift.endTime);
  
  const getClassName = (): string => {
    let className = `shift-bar shift-bar_type_${type}`;
    if (status && status !== 'normal') {
      className += ` shift-bar_status_${status}`;
    }
    return className;
  };

  const getDisplayText = (): string => {
    if (type === 'plan') {
      const startTime = new Date(shift.startTime).toLocaleTimeString('ru', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      const endTime = new Date(shift.endTime).toLocaleTimeString('ru', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      return `${shift.role} (${startTime} - ${endTime})`;
    }
    
    if (status === 'absent') {
      return 'Отсутствовал';
    }
    
    // Для факта показываем диапазон времени
    const startTime = new Date(shift.startTime).toLocaleTimeString('ru', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    const endTime = new Date(shift.endTime).toLocaleTimeString('ru', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    return `${startTime} - ${endTime}`;
  };

  return (
    <div 
      className={getClassName()}
      style={position}
      onClick={onClick}
      title={`${shift.employee} - ${shift.role}`}
    >
      {getDisplayText()}
    </div>
  );
};