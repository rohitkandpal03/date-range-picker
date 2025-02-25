import React, { useState, useRef, useEffect } from "react";
import "./MonthYearSelector.css";

interface MonthYearSelectorProps {
  currentDate: Date;
  onMonthYearChange: (year: number, month: number) => void;
}

const MonthYearSelector: React.FC<MonthYearSelectorProps> = ({
  currentDate,
  onMonthYearChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const yearsListRef = useRef<HTMLDivElement>(null);

  const startYear = 1990;
  const endYear = 3024;
  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i
  );
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    if (isOpen && yearsListRef.current) {
      const selectedYearElement = yearsListRef.current.querySelector(
        `.year-item[data-year="${selectedYear}"]`
      );
      if (selectedYearElement) {
        selectedYearElement.scrollIntoView({
          block: "center",
          behavior: "auto",
        });
      }
    }
  }, [isOpen, selectedYear]);

  const handleYearClick = (year: number) => {
    setSelectedYear(year);
    onMonthYearChange(year, selectedMonth);
  };

  const handleMonthClick = (monthIndex: number) => {
    setSelectedMonth(monthIndex);
    onMonthYearChange(selectedYear, monthIndex);
    setIsOpen(false);
  };

  return (
    <div className="month-year-selector">
      <button className="selector-trigger" onClick={() => setIsOpen(!isOpen)}>
        {currentDate.toLocaleString("default", {
          month: "long",
          year: "numeric",
        })}
      </button>
      {isOpen && (
        <div className="selector-dropdown">
          <div className="selector-grid">
            <div className="years-list" ref={yearsListRef}>
              {years.map((year) => (
                <button
                  key={year}
                  data-year={year}
                  className={`year-item ${year === selectedYear ? "selected" : ""}`}
                  onClick={() => handleYearClick(year)}
                >
                  {year}
                </button>
              ))}
            </div>
            <div className="months-list">
              {months.map((month, index) => (
                <button
                  key={month}
                  className={`month-item ${index === selectedMonth ? "selected" : ""}`}
                  onClick={() => handleMonthClick(index)}
                >
                  {month}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthYearSelector;
