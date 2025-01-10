export const normalizeDate = (date: Date): Date => {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  };
  
  export const formatDateKey = (date: Date): string => 
    date.toISOString().split("T")[0];