import React, { useState, useRef } from "react";
import "./WeekdayDateRangePicker.css";
import { isWeekend, formatDisplayDate, getDaysInMonth } from "./helper";
import { useDateRangeSelection } from "../hooks/useDateRangeSelection";

interface WeekdayDateRangePickerProps {
  onChange: (dateRange: [string, string], weekends: string[]) => void;
}

const WeekdayDateRangePicker: React.FC<WeekdayDateRangePickerProps> = ({
  onChange,
}) => {
  // Add new state for hover
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isSelecting, setIsSelecting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const [selectedRange, setSelectedRange] = useDateRangeSelection({ onChange });

  const handleDateClick = (date: Date) => {
    if (isWeekend(date)) return;

    if (!isSelecting || !selectedRange.startDate) {
      setSelectedRange({ startDate: date, endDate: null, autoFetch: false });
      setIsSelecting(true);
    } else {
      const start = selectedRange.startDate;
      if (date < start) {
        setSelectedRange({
          startDate: date,
          endDate: start,
          autoFetch: false,
        });
      } else {
        setSelectedRange({
          startDate: start,
          endDate: date,
          autoFetch: false,
        });
      }
      setIsSelecting(false);
    }
  };

  const renderCalendarMonth = (monthOffset: number) => {
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
            <button onClick={() => setCurrentDate(new Date(year, month - 1))}>
              &lt;
            </button>
          )}
          <span>
            {new Date(year, month).toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </span>
          {monthOffset === 1 && (
            <button onClick={() => setCurrentDate(new Date(year, month + 1))}>
              &gt;
            </button>
          )}
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
                onClick={() => !isWeekendDay && handleDateClick(date)}
                onMouseEnter={() => !isWeekendDay && setHoverDate(date)}
                onMouseLeave={() => setHoverDate(null)}
              >
                {date.getDate()}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="picker-container" ref={pickerRef}>
      <div className="input-trigger" onClick={() => setIsOpen(!isOpen)}>
        <span>
          {selectedRange.startDate
            ? `${formatDisplayDate(
                selectedRange.startDate
              )} - ${formatDisplayDate(selectedRange.endDate)}`
            : "dd/mm/yyyy ~ dd/mm/yyyy"}
        </span>

        <span className="calendar-icon">
          <img src="/calendar.png" width={18} height={18} alt="calender" />
        </span>
      </div>
      <div className={`picker-dropdown ${isOpen ? "open" : ""}`}>
        <div className="weekday-date-range-picker">
          <div className="calendars-container">
            {renderCalendarMonth(0)}
            {renderCalendarMonth(1)}
          </div>
          <div className="predefined-ranges">
            <button
              onClick={() => {
                const today = new Date();
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(today.getDate() - 7);
                setSelectedRange({
                  startDate: sevenDaysAgo,
                  endDate: today,
                  autoFetch: true,
                });
                setIsOpen(false);
              }}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => {
                const today = new Date();
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(today.getDate() - 30);
                setSelectedRange({
                  startDate: sevenDaysAgo,
                  endDate: today,
                  autoFetch: true,
                });
                setIsOpen(false);
              }}
            >
              Last 30 Days
            </button>
            <button
              onClick={() => {
                setSelectedRange((prev: any) => ({ ...prev, autoFetch: true }));
                setIsOpen(false);
              }}
              className="ok-button"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeekdayDateRangePicker;
