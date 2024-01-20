import LIMITS from "models/limits";

export function convertDateToYYYYMMDD(date: Date, separator: string) {
    const year = date.getFullYear().toString();

    let month = (date.getMonth() + 1).toString();
    if (month.length < 2) {
        month = `0${month}`;
    }

    let day = date.getDate().toString();
    if (day.length < 2) {
        day = `0${day}`;
    }

    return `${year}${separator}${month}${separator}${day}`;
}

export function getTodayUTCDate() {
    let options = { timeZone: 'America/New_York' };
    let eastCoastTime = new Date().toLocaleString('en-US', options);
    return new Date(eastCoastTime);
}

export function checkIsDateCorrect(date: Date) {
    const currentDate = new Date(convertDateToYYYYMMDD(date, '-'));
    const maxDate = new Date(LIMITS.maxDateStr);
    const minDate = new Date(LIMITS.minDateStr);

    return (minDate <= currentDate && currentDate <= maxDate)
        ? true
        : false;
}

export function fixToCorrectDate(date: Date) {
    return date < LIMITS.minDate
        ? LIMITS.minDate
        : date > LIMITS.maxDate
            ? LIMITS.maxDate
            : date;
}

export function checkIsPeriodCorrect(period: Date[]) {
    const startRange = period[0];
    const endRange = period[1];

    const isStartRangeCorrect = checkIsDateCorrect(startRange);
    const isEndRangeCorrect = checkIsDateCorrect(endRange);

    if (!isStartRangeCorrect || !isEndRangeCorrect) return false;

    return startRange <= endRange
        ? true
        : false;
}

export function fixToCorrectPeriod(period: Date[]) {
    const correctPeriod = [...period];

    correctPeriod[0] = fixToCorrectDate(period[0]);
    correctPeriod[1] = fixToCorrectDate(period[1]);

    if (correctPeriod[0] > correctPeriod[1]) {
        const startPeriod = correctPeriod[0];
        correctPeriod[0] = correctPeriod[1];
        correctPeriod[1] = startPeriod;
    }

    return correctPeriod;
}