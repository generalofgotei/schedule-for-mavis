import { Shift, ShiftPosition, ShiftStatus } from '../types';

export const formatTime = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString('ru', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

export const getHourFromDate = (dateString: string): number => {
  return new Date(dateString).getHours();
};

export const getMinuteFromDate = (dateString: string): number => {
  return new Date(dateString).getMinutes();
};

export const calculatePosition = (startTime: string, endTime: string): ShiftPosition => {
  const startHour = getHourFromDate(startTime);
  const startMinute = getMinuteFromDate(startTime);
  const endHour = getHourFromDate(endTime);
  const endMinute = getMinuteFromDate(endTime);
  
  const left = (startHour + startMinute / 60) * (100 / 24);
  const width = ((endHour + endMinute / 60) - (startHour + startMinute / 60)) * (100 / 24);
  
  return { left: `${left}%`, width: `${width}%` };
};

export const getShiftStatus = (planShift: Shift, factShift: Shift | undefined): ShiftStatus => {
  if (!factShift) return 'absent';
  
  const planStart = new Date(planShift.startTime);
  const factStart = new Date(factShift.startTime);
  const planEnd = new Date(planShift.endTime);
  const factEnd = new Date(factShift.endTime);
  
  // Проверяем опоздание (пришел позже)
  if (factStart > planStart) return 'late';
  
  // Проверяем ранний уход (ушел раньше)  
  if (factEnd < planEnd) return 'early';
  
  return 'normal';
};

export const calculateDuration = (startTime: string, endTime: string): number => {
  return Math.round((new Date(endTime).getTime() - new Date(startTime).getTime()) / (1000 * 60));
};

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}ч ${mins}м`;
};

export const isShiftInDateRange = (shift: Shift, startDate: string, endDate: string): boolean => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);
  
  const shiftDate = new Date(shift.startTime);
  return shiftDate >= start && shiftDate <= end;
};

export const findMatchingFactShift = (planShift: Shift, factShifts: Shift[]): Shift | undefined => {
  return factShifts.find(factShift => 
    factShift.employee === planShift.employee &&
    factShift.store === planShift.store &&
    Math.abs(new Date(factShift.startTime).getTime() - new Date(planShift.startTime).getTime()) < 4 * 60 * 60 * 1000
  );
};

export const isDateInPastOrToday = (dateString: string): boolean => {
  const today = new Date();
  const checkDate = new Date(dateString);
  
  // Сравниваем только даты без времени
  today.setHours(0, 0, 0, 0);
  checkDate.setHours(0, 0, 0, 0);
  
  return checkDate <= today;
};