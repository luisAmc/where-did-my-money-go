import { format, startOfDay } from 'date-fns';
import { es as esLocale } from 'date-fns/locale/es';

export function formatDate(
    givenDate: string | Date,
    pattern: string = 'dd/MM/yyy',
) {
    if (givenDate == null || isNaN(Date.parse(givenDate.toString()))) {
        return '-';
    }

    const date = new Date(givenDate);

    return format(date, pattern, { locale: esLocale });
}

export function formatAmount(
    amount: number,
    options: Intl.NumberFormatOptions = {
        maximumFractionDigits: 2,
    },
) {
    if (amount == null || isNaN(amount)) {
        return '-';
    }

    const currencyAmount = new Intl.NumberFormat('es-HN', options).format(
        amount,
    );

    return currencyAmount;
}

export function plainDateToLocal(plainDateString: string) {
    const [year, month, day] = plainDateString.split('-');

    const date = new Date();

    date.setFullYear(Number(year));
    date.setMonth(Number(month) - 1);
    date.setDate(Number(day));

    return startOfDay(date);
}
