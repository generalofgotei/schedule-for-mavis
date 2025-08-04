import React from 'react';

interface LegendItemProps {
  colorClass: string;
  label: string;
}

const LegendItem: React.FC<LegendItemProps> = ({ colorClass, label }) => (
  <div className="legend__item">
    <div className={`legend__color ${colorClass}`}></div>
    <span>{label}</span>
  </div>
);

export const Legend: React.FC = () => {
  return (
    <div className="legend">
      <span className="legend__title">Метки:</span>
      <LegendItem colorClass="legend__color_type_plan" label="План" />
      <LegendItem colorClass="legend__color_type_fact" label="Факт" />
      <LegendItem colorClass="legend__color_status_late" label="Опоздал" />
      <LegendItem colorClass="legend__color_status_early" label="Ушел раньше" />
      <LegendItem colorClass="legend__color_status_absent" label="Не явился" />
    </div>
  );
};