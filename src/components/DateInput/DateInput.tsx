import React from 'react';
import { formatDisplayDate } from '../helper';
import './DateInput.css';

interface DateInputProps {
  selectedRange: {
    startDate: Date | null;
    endDate: Date | null;
  };
  isOpen: boolean;
  onToggle: () => void;
}

const DateInput: React.FC<DateInputProps> = ({
  selectedRange,
  isOpen,
  onToggle,
}) => {
  return (
    <div className="input-trigger" onClick={onToggle}>
      <span>
        {selectedRange.startDate
          ? `${formatDisplayDate(selectedRange.startDate)} - ${formatDisplayDate(
              selectedRange.endDate
            )}`
          : "dd/mm/yyyy ~ dd/mm/yyyy"}
      </span>
      <span className="calendar-icon">
        <img src="/calendar.png" width={18} height={18} alt="calendar" />
      </span>
    </div>
  );
};

export default DateInput;