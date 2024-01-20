import { convertDateToYYYYMMDD, getTodayUTCDate } from "logic/utils/dateConverter";

const LIMITS = {
    minDateStr: "1995-06-16",
    minDate: new Date(new Date("1995-06-16").toLocaleString('en-US', { timeZone: 'America/New_York' })),
    maxDateStr: convertDateToYYYYMMDD(getTodayUTCDate(), '-'),
    maxDate: getTodayUTCDate(),
}

export default LIMITS;