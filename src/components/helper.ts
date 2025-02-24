export const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

export const formatDate = (date: Date): string => {
  const newDate = new Date(date);
  newDate.setHours(12, 0, 0, 0);
  return newDate.toISOString().split("T")[0];
};

export const formatDisplayDate = (date: Date | null): string => {
  if (!date) return "";
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export const getDaysInMonth = (year: number, month: number): Date[] => {
  const days: Date[] = [];
  const lastDay = new Date(year, month + 1, 0);

  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d));
  }
  return days;
};
