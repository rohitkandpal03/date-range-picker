import React, { Dispatch, SetStateAction } from "react";
import { isWeekend, getDaysInMonth } from "../helper";
import MonthYearSelector from "../MonthYearSelector/MonthYearSelector";
import "./Calendar.css";

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
  onMonthChange: (direction: "prev" | "next") => void;
  setCurrentDate: Dispatch<SetStateAction<Date>>;
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
  setCurrentDate,
}) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + monthOffset;
  const adjustedDate = new Date(year, month);
  const days = getDaysInMonth(adjustedDate.getFullYear(), adjustedDate.getMonth());
  const firstDay = new Date(adjustedDate.getFullYear(), adjustedDate.getMonth(), 1);
  const emptyDays = (firstDay.getDay() + 6) % 7;
  const paddingDays = Array(emptyDays).fill(null);

  const handleMonthYearChange = (year: number, month: number) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(year);
    newDate.setMonth(month);
    setCurrentDate(newDate);
  };

  const handleMonthChange = (direction: "prev" | "next") => {
    onMonthChange(direction);
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button 
          className={`nav-button ${monthOffset === 0 ? 'left' : 'right'}`}
          onClick={() => handleMonthChange("prev")}
        >
          &lt;
        </button>
        <MonthYearSelector
          currentDate={adjustedDate}
          onMonthYearChange={handleMonthYearChange}
        />
        <button 
          className={`nav-button ${monthOffset === 0 ? 'left' : 'right'}`}
          onClick={() => handleMonthChange("next")}
        >
          &gt;
        </button>
      </div>
      <div className="calendar-grid">
        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Sun"].map((day) => (
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
              className={`calendar-day ${isSelected ? "selected" : ""} ${
                isWeekendDay ? "weekend" : ""
              } ${isInRange ? "in-range" : ""} ${
                isHoverRange ? "hover-range" : ""
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
