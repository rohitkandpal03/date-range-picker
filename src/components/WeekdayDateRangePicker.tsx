import React, { useState, useRef, use } from "react";
import "./WeekdayDateRangePicker.css";
import { isWeekend } from "./helper";
import { useDateRangeSelection } from "../hooks/useDateRangeSelection";
import Calendar from "./Calendar/Calendar";
import DateInput from "./DateInput/DateInput";
import PresetRanges from "./PresetRanges/PresetRanges";

interface WeekdayDateRangePickerProps {
  onChange: (dateRange: [string, string], weekends: string[]) => void;
}

const WeekdayDateRangePicker: React.FC<WeekdayDateRangePickerProps> = ({
  onChange,
}) => {
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [leftDate, setLeftDate] = useState(new Date());
  const [rightDate, setRightDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date;
  });
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

  const handleMonthChange = (direction: "prev" | "next", isLeftCalendar: boolean) => {
    if (isLeftCalendar) {
      const year = leftDate.getFullYear();
      const month = leftDate.getMonth();
      const newDate = new Date(year, direction === "prev" ? month - 1 : month + 1);
      
      // Ensure left calendar doesn't go past right calendar
      if (newDate < rightDate) {
        setLeftDate(newDate);
      }
    } else {
      const year = rightDate.getFullYear();
      const month = rightDate.getMonth();
      const newDate = new Date(year, direction === "prev" ? month - 1 : month + 1);
      
      // Ensure right calendar doesn't go before left calendar
      if (newDate > leftDate) {
        setRightDate(newDate);
      }
    }
  };
  const handlePresetSelect = (startDate: Date, endDate: Date) => {
    setSelectedRange({
      startDate,
      endDate,
      autoFetch: true,
    });
    setIsOpen(false);
  };

  const handleConfirm = () => {
    setSelectedRange((prev: any) => ({ ...prev, autoFetch: true }));
    setIsOpen(false);
  };

  return (
    <div className="picker-container" ref={pickerRef}>
      <DateInput
        selectedRange={selectedRange}
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
      <div className={`picker-dropdown ${isOpen ? "open" : ""}`}>
        <div className="weekday-date-range-picker">
          <div className="calendars-container">
            <Calendar
              currentDate={leftDate}
              selectedRange={selectedRange}
              isSelecting={isSelecting}
              hoverDate={hoverDate}
              monthOffset={0}
              onDateClick={handleDateClick}
              onDateHover={setHoverDate}
              onMonthChange={(direction) => handleMonthChange(direction, true)}
              setCurrentDate={setLeftDate}
            />
            <Calendar
              currentDate={rightDate}
              selectedRange={selectedRange}
              isSelecting={isSelecting}
              hoverDate={hoverDate}
              monthOffset={0}
              onDateClick={handleDateClick}
              onDateHover={setHoverDate}
              onMonthChange={(direction) => handleMonthChange(direction, false)}
              setCurrentDate={setRightDate}
            />
          </div>
          <PresetRanges
            onSelectPreset={handlePresetSelect}
            onConfirm={handleConfirm}
          />
        </div>
      </div>
    </div>
  );
};

export default WeekdayDateRangePicker;
