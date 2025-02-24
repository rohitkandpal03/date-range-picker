import React, { useState, useRef } from "react";
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

  const handleMonthChange = (direction: "prev" | "next") => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    setCurrentDate(
      new Date(year, direction === "prev" ? month - 1 : month + 1)
    );
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
              currentDate={currentDate}
              selectedRange={selectedRange}
              isSelecting={isSelecting}
              hoverDate={hoverDate}
              monthOffset={0}
              onDateClick={handleDateClick}
              onDateHover={setHoverDate}
              onMonthChange={handleMonthChange}
            />
            <Calendar
              currentDate={currentDate}
              selectedRange={selectedRange}
              isSelecting={isSelecting}
              hoverDate={hoverDate}
              monthOffset={1}
              onDateClick={handleDateClick}
              onDateHover={setHoverDate}
              onMonthChange={handleMonthChange}
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
