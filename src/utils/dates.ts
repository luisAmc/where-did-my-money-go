import { endOfMonth, startOfMonth, StartOfWeekOptions } from 'date-fns';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';

const TIMEZONE = 'CST';

type DateOrString = Date | string;
type DateOptions = StartOfWeekOptions;

function _calcZonedDate(
    date: DateOrString,
    timezone: string,
    fn: (date: Date, options?: DateOptions) => Date,
    options: DateOptions | null = null,
) {
    const safeDate = new Date(date);

    const zonedTime = toZonedTime(safeDate, timezone);
    const fnZoned = options ? fn(zonedTime, options) : fn(zonedTime);

    return fromZonedTime(fnZoned, timezone);
}

export function getZonedStartOfMonth(date: DateOrString) {
    return _calcZonedDate(date, TIMEZONE, startOfMonth);
}

export function getZonedEndOfMonth(date: DateOrString) {
    return _calcZonedDate(date, TIMEZONE, endOfMonth);
}
