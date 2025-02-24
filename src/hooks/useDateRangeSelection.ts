import { useState, useEffect } from "react";
import { formatDate } from "../components/helper";

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
  autoFetch: boolean;
}

interface UseDateRangeProps {
  onChange: (dateRange: [string, string], weekends: string[]) => void;
}

export const useDateRangeSelection = ({
  onChange,
}: UseDateRangeProps): [DateRange, (range: any) => void] => {
  const [selectedRange, setSelectedRange] = useState<DateRange>({
    startDate: null,
    endDate: null,
    autoFetch: false,
  });

  useEffect(() => {
    if (
      selectedRange.startDate &&
      selectedRange.endDate &&
      selectedRange.autoFetch
    ) {
      const startDate = new Date(selectedRange.startDate);
      const endDate = new Date(selectedRange.endDate);

      // Set time to noon to avoid timezone issues
      startDate.setHours(12, 0, 0, 0);
      endDate.setHours(12, 0, 0, 0);

      const dateRange: [string, string] = [
        formatDate(startDate),
        formatDate(endDate),
      ];
      const weekends = getWeekendDates(startDate, endDate);
      onChange(dateRange, weekends);
    }
  }, [selectedRange]);

  //get weekends date
  const getWeekendDates = (start: Date, end: Date): string[] => {
    const weekends: string[] = [];
    const current = new Date(start);

    while (current <= end) {
      if (current.getDay() === 0 || current.getDay() === 6) {
        weekends.push(formatDate(current));
      }
      current.setDate(current.getDate() + 1);
    }
    return weekends;
  };

  return [selectedRange, setSelectedRange];
};
