export interface Shift {
  employee: string;
  store: string;
  role: string;
  startTime: string;
  endTime: string;
}

export interface ScheduleData {
  plan: Shift[];
  fact: Shift[];
}

export interface EmployeeRow {
  employee: string;
  store: string;
  planShifts: Shift[];
  factShifts: Shift[];
}

export type ShiftStatus = 'normal' | 'late' | 'early' | 'absent';

export type ShiftType = 'plan' | 'fact';

export interface ShiftPosition {
  left: string;
  width: string;
}

export interface TooltipData {
  x: number;
  y: number;
  text: string;
}

export interface ScheduleState {
  startDate: string;
  endDate: string;
  planData: Shift[];
  factData: Shift[];
  tooltip: TooltipData | null;
}