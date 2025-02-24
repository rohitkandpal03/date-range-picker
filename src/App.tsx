import React, { useState } from "react";
import WeekdayDateRangePicker from "./components/WeekdayDateRangePicker";
import styles from "./App.module.css";

const App: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<any>({});
  const handleDateRangeChange = (
    dateRange: [string, string],
    weekends: string[]
  ) => {
    console.log("Selected date range :", dateRange);
    console.log("Weekend dates:", weekends);
    setSelectedDate({ dateRange, weekends });
  };

  return (
    <div className={styles.container}>
      <h2>Data Range Picker</h2>
      <WeekdayDateRangePicker onChange={handleDateRangeChange} />
      {!!selectedDate?.dateRange && (
        <>
          <div className={styles.dateRange}>
            <b>Selected date range :</b>
            {selectedDate.dateRange.map((range: string, index: number) => (
              <span key={`date-range-${index + 1}`}>{range}</span>
            ))}
          </div>
          <div className={styles.dateRange}>
            <b>Weekend dates :</b>
            <div className={styles.weekendDates}>
              {selectedDate.weekends.map((weekend: string, index: number) => (
                <span key={`weekends-${index + 1}`}>{weekend}</span>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
