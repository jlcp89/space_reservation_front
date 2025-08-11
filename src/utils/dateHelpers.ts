import { format, parseISO, isValid, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';

export const formatDate = (date: string | Date, formatStr: string = 'PPP'): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return 'Invalid Date';
    return format(dateObj, formatStr);
  } catch (error) {
    return 'Invalid Date';
  }
};

export const formatTime = (time: string): string => {
  try {
    // Convert HH:mm to 12-hour format
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  } catch (error) {
    return time;
  }
};

export const formatDateTime = (date: string, time: string): string => {
  try {
    return `${formatDate(date, 'MMM d, yyyy')} at ${formatTime(time)}`;
  } catch (error) {
    return `${date} at ${time}`;
  }
};

export const getTodayString = (): string => {
  return format(new Date(), 'yyyy-MM-dd');
};

export const getTomorrowString = (): string => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return format(tomorrow, 'yyyy-MM-dd');
};

export const isDateInCurrentWeek = (date: string | Date): boolean => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 }); // Sunday
    
    return isWithinInterval(dateObj, { start: weekStart, end: weekEnd });
  } catch (error) {
    return false;
  }
};

export const getWeekBounds = (date: string | Date): { start: string; end: string } => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const weekStart = startOfWeek(dateObj, { weekStartsOn: 1 }); // Monday
    const weekEnd = endOfWeek(dateObj, { weekStartsOn: 1 }); // Sunday
    
    return {
      start: format(weekStart, 'yyyy-MM-dd'),
      end: format(weekEnd, 'yyyy-MM-dd')
    };
  } catch (error) {
    return { start: '', end: '' };
  }
};

export const isValidDate = (dateString: string): boolean => {
  try {
    const date = parseISO(dateString);
    return isValid(date);
  } catch (error) {
    return false;
  }
};

export const isValidTime = (timeString: string): boolean => {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(timeString);
};