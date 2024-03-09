import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const currentDateLocale = ptBR;
const localUTC = 0;

const addCurrentUTCToDate = (date: Date) => {
    return new Date(date.setHours(date.getHours() + localUTC))
}
const addCurrentUTCToStringDate = (date: string): Date => {
    return addCurrentUTCToDate(new Date(date))
}

export function useDateFormat() {
    // const formatStringDate = (date: string) => {
    //     const currentDateLocale = addCurrentUTCToStringDAte(date);
    //     return format(currentDateLocale, 'dd/MM/yyyy HH:mm:ss', { locale: currentDateLocale })
    // }

    const formatDateTimeToMinutesAgo = (date: string) => {
        return formatDistanceToNow(addCurrentUTCToStringDate(date), { locale: currentDateLocale, addSuffix: true })
    }

    const formatDateTimeToMinutesAgoShort = (date: string) => {
        return formatDistanceToNow(addCurrentUTCToStringDate(date), { locale: currentDateLocale, addSuffix: true, includeSeconds: true })
    }

    return {

        formatDateTimeToMinutesAgo,
        formatDateTimeToMinutesAgoShort
    }
}




