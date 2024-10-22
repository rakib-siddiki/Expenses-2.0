import { endOfDay, parseISO, startOfDay } from 'date-fns';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';

const BDT_TIMEZONE = 'Asia/Dhaka';

export function getBDTDayRange(date: Date | string) {
    // Ensure we're working with a Date object
    const inputDate = typeof date === 'string' ? parseISO(date) : date;

    // Convert the input date to Bangladesh time
    const bdtDate = toZonedTime(inputDate, BDT_TIMEZONE);
    // Get the start of the day in BDT
    const startOfBDTDay = startOfDay(bdtDate);
    // Get the end of the day in BDT
    const endOfBDTDay = endOfDay(bdtDate);
    // Convert back to UTC for database query
    const startOfDayUTC = fromZonedTime(startOfBDTDay, BDT_TIMEZONE);
    const endOfDayUTC = fromZonedTime(endOfBDTDay, BDT_TIMEZONE);

    return {
        startOfDay: startOfDayUTC,
        endOfDay: endOfDayUTC,
    };
}
