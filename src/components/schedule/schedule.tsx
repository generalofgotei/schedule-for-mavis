import React from 'react';
import { ScheduleRow } from '../schedule-row/schedule-row';
import { Legend } from '../legend/legend';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { selectFilteredData, selectTooltip, selectDateRange } from '../../store/selectors';
import { setTooltip } from '../../store/slices/scheduleSlice';

const Tooltip: React.FC = () => {
  const tooltip = useAppSelector(selectTooltip);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!(e.target as Element)?.closest('.shift-bar')) {
        dispatch(setTooltip(null));
      }
    };

    if (tooltip) {
      document.addEventListener('click', handleClick);
      return () => {
        document.removeEventListener('click', handleClick);
      };
    }
  }, [tooltip, dispatch]);
  
  if (!tooltip) return null;
  
  return (
    <div 
      className="tooltip"
      style={{ left: tooltip.x, top: tooltip.y }}
    >
      {tooltip.text}
    </div>
  );
};

export const Schedule: React.FC = () => {
  const filteredData = useAppSelector(selectFilteredData);
  const { dates } = useAppSelector(selectDateRange);

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  if (filteredData.length === 0) {
    return (
      <div className="schedule">
        <div className="schedule__table">
          <div className="schedule__fixed-columns">
            <div className="schedule__header-fixed">
              <div className="schedule__header-cell schedule__header-cell_fixed">Сотрудник</div>
              <div className="schedule__header-cell schedule__header-cell_fixed">Магазин</div>
            </div>
          </div>
          <div className="schedule__scrollable-area">
            <div className="schedule__header-cell">
              Нет данных для отображения
            </div>
          </div>
        </div>
        <Legend />
        <Tooltip />
      </div>
    );
  }

  return (
    <div className="schedule">
      <div className="schedule__table">
        <div className="schedule__fixed-columns">
          <div className="schedule__header-fixed">
            <div className="schedule__header-cell schedule__header-cell_fixed">Сотрудник</div>
            <div className="schedule__header-cell schedule__header-cell_fixed">Магазин</div>
          </div>
          {filteredData.map((rowData, index) => (
            <div key={`${rowData.employee}-${rowData.store}-${index}`} className="schedule-row__fixed">
              <div className="schedule-row__cell">{rowData.employee}</div>
              <div className="schedule-row__cell">{rowData.store}</div>
            </div>
          ))}
        </div>

        <div className="schedule__scrollable-area">
          <div className="schedule__header">
            <div className="schedule__days">
              {dates.map(date => (
                <div key={date} className="schedule__day">
                  <div className="schedule__date">{formatDate(date)}</div>
                  <div className="schedule__timeline">
                    {Array.from({ length: 24 }, (_, i) => (
                      <div key={i} className="schedule__hour">
                        {i.toString().padStart(2, '0')}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {filteredData.map((rowData, index) => (
            <div key={`shifts-${rowData.employee}-${rowData.store}-${index}`} className="schedule-row__shifts-container">
              {dates.map(date => (
                <div key={date} className="schedule-row__day">
                  <ScheduleRow 
                    data={rowData}
                    currentDate={date}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      <Legend />
      <Tooltip />
    </div>
  );
};