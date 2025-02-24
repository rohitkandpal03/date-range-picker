import React from 'react';
import { isWeekend, getDaysInMonth } from '../helper';
import './Calendar.css';

interface CalendarProps {
  currentDate: Date;
  selectedRange: {
    startDate: Date | null;
    endDate: Date | null;
  };
  isSelecting: boolean;
  hoverDate: Date | null;
  monthOffset: number;
  onDateClick: (date: Date) => void;
  onDateHover: (date: Date | null) => void;
  onMonthChange: (direction: 'prev' | 'next') => void;
}

const Calendar: React.FC<CalendarProps> = ({
  currentDate,
  selectedRange,
  isSelecting,
  hoverDate,
  monthOffset,
  onDateClick,
  onDateHover,
  onMonthChange,
}) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + monthOffset;
  const days = getDaysInMonth(year, month);
  const firstDay = new Date(year, month, 1);
  const emptyDays = (firstDay.getDay() + 6) % 7;
  const paddingDays = Array(emptyDays).fill(null);

  return (
    <div className="calendar">
      <div className="calendar-header">
        {monthOffset === 0 && (
          <button onClick={() => onMonthChange('prev')}>&lt;</button>
        )}
        <span>
          {new Date(year, month).toLocaleString('default', {
            month: 'long',
            year: 'numeric',
          })}
        </span>
        {monthOffset === 1 && (
          <button onClick={() => onMonthChange('next')}>&gt;</button>
        )}
      </div>
      <div className="calendar-grid">
        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Sun'].map((day) => (
          <div key={day} className="calendar-day-header">
            {day}
          </div>
        ))}
        {paddingDays.map((_, index) => (
          <div key={`empty-${index}`} className="calendar-day empty"></div>
        ))}
        {days.map((date) => {
          const isSelected =
            selectedRange.startDate &&
            selectedRange.endDate &&
            date >= selectedRange.startDate &&
            date <= selectedRange.endDate;

          const isWeekendDay = isWeekend(date);

          const isHoverRange =
            isSelecting &&
            selectedRange.startDate &&
            !selectedRange.endDate &&
            hoverDate &&
            ((date >= selectedRange.startDate && date <= hoverDate) ||
              (date <= selectedRange.startDate && date >= hoverDate));

          const isInRange =
            selectedRange.startDate &&
            selectedRange.endDate &&
            date > selectedRange.startDate &&
            date < selectedRange.endDate;

          return (
            <div
              key={date.toISOString()}
              className={`calendar-day ${isSelected ? 'selected' : ''} ${
                isWeekendDay ? 'weekend' : ''
              } ${isInRange ? 'in-range' : ''} ${
                isHoverRange ? 'hover-range' : ''
              }`}
              onClick={() => !isWeekendDay && onDateClick(date)}
              onMouseEnter={() => !isWeekendDay && onDateHover(date)}
              onMouseLeave={() => onDateHover(null)}
            >
              {date.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;